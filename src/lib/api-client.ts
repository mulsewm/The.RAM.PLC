import { cookies, headers } from 'next/headers';
import { ApiError, UnauthorizedError } from './error-handler';
import { getBaseUrl } from './utils';

declare global {
  interface Window {
    ENV: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  token?: string | (() => Promise<string | null>);
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private withCredentials: boolean;
  private token?: string | (() => Promise<string | null>);
  private abortController: AbortController;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || getBaseUrl();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.withCredentials = config.withCredentials ?? true;
    this.token = config.token;
    this.abortController = new AbortController();
  }

  private async getAuthToken(): Promise<string | null> {
    if (!this.token) {
      // Try to get token from cookies by default
      if (typeof window !== 'undefined') {
        // Client-side
        const value = `; ${document.cookie}`;
        const parts = value.split('; access_token=');
        if (parts.length === 2) {
          return parts.pop()?.split(';').shift() || null;
        }
        return null;
      } else {
        // Server-side
        const cookieStore = await cookies();
        return cookieStore.get('access_token')?.value || null;
      }
    }

    if (typeof this.token === 'function') {
      return this.token();
    }

    return this.token;
  }

  private async getHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
    const headers = new Headers(this.defaultHeaders);

    // Add auth token if available
    if (this.withCredentials) {
      const token = await this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Add custom headers
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          headers.set(key, String(value));
        }
      });
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    let data: any;
    
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new ApiError(`Failed to parse response: ${errorMessage}`, 500, 'RESPONSE_PARSE_ERROR');
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (e.g., token expired)
        throw new UnauthorizedError(data?.message || 'Authentication required');
      }

      throw new ApiError(
        data?.message || 'An error occurred',
        response.status,
        data?.code,
        data?.details
      );
    }

    return data;
  }

  private async request<T>(
    method: RequestMethod,
    endpoint: string,
    data?: any,
    options: {
      headers?: Record<string, string>;
      params?: Record<string, any>;
      signal?: AbortSignal;
    } = {}
  ): Promise<T> {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`);
    
    // Add query params for GET requests
    if (method === 'GET' && options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = await this.getHeaders(options.headers);
    const requestInit: RequestInit = {
      method,
      headers,
      signal: options.signal || this.abortController.signal,
      credentials: this.withCredentials ? 'include' : 'same-origin',
    };

    // Add body for non-GET requests
    if (method !== 'GET' && data !== undefined) {
      if (data instanceof FormData) {
        // Remove content-type header for FormData to let the browser set it with the correct boundary
        (requestInit.headers as Headers).delete('Content-Type');
        requestInit.body = data;
      } else if (typeof data === 'object') {
        requestInit.body = JSON.stringify(data);
      } else {
        requestInit.body = String(data);
      }
    }

    try {
      const response = await fetch(url.toString(), requestInit);
      return this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request was aborted', 0, 'ABORTED');
        }
        throw error;
      }
      throw new ApiError('An unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  // CRUD methods
  get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: { headers?: Record<string, string>; signal?: AbortSignal }
  ): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, {
      ...options,
      params,
    });
  }

  post<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string>; signal?: AbortSignal }
  ): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  put<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string>; signal?: AbortSignal }
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  patch<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string>; signal?: AbortSignal }
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  delete<T = any>(
    endpoint: string,
    options?: { 
      headers?: Record<string, string>; 
      data?: any;
      signal?: AbortSignal;
    }
  ): Promise<T> {
    return this.request<T>('DELETE', endpoint, options?.data, {
      headers: options?.headers,
      signal: options?.signal,
    });
  }

  // File upload helper
  upload<T = any>(
    endpoint: string,
    file: File,
    options: {
      fieldName?: string;
      data?: Record<string, any>;
      onProgress?: (progress: number) => void;
      signal?: AbortSignal;
    } = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      // Add file
      formData.append(options.fieldName || 'file', file);
      
      // Add additional data
      if (options.data) {
        Object.entries(options.data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value as any);
          }
        });
      }
      
      // Set up progress tracking
      if (options.onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && event.total > 0) {
            const percent = Math.round((event.loaded / event.total) * 100);
            options.onProgress?.(percent);
          }
        });
      }
      
      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText as any);
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new ApiError(
              error.message || 'Upload failed',
              xhr.status,
              error.code
            ));
          } catch (e) {
            reject(new ApiError('Upload failed', xhr.status));
          }
        }
      };
      
      // Handle errors
      xhr.onerror = () => {
        reject(new ApiError('Network error', 0, 'NETWORK_ERROR'));
      };
      
      // Handle abort
      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new ApiError('Upload aborted', 0, 'ABORTED'));
        });
      }
      
      // Open and send the request
      xhr.open('POST', `${this.baseURL}${endpoint}`, true);
      
      // Set headers
      xhr.setRequestHeader('Accept', 'application/json');
      
      // Get and set auth token if available
      this.getAuthToken().then(token => {
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        // Send the request
        xhr.send(formData);
      }).catch(reject);
    });
  }

  // Abort all pending requests
  abort() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }
}

// Create a default instance
export const apiClient = new ApiClient({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// Server-side API client that works in Server Components and Route Handlers
export function createServerApiClient(request?: Request) {
  const headers = new Headers();
  
  // Forward necessary headers from the original request
  if (request) {
    const forwardedHeaders = [
      'authorization',
      'cookie',
      'x-forwarded-for',
      'x-real-ip',
      'user-agent',
    ];
    
    forwardedHeaders.forEach(header => {
      const value = request.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    });
  }
  
  return new ApiClient({
    baseURL: getBaseUrl(),
    headers: Object.fromEntries(headers.entries()),
  });
}

// Hook for components to access the API client
// Note: This is a client-side hook, not for Server Components
export function useApiClient() {
  // In a real implementation, you might want to get the auth token from context
  // For now, we'll use the default client which handles cookies automatically
  return apiClient;
}
