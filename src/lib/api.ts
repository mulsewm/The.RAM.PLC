import { AuthContextType } from '@/lib/auth-provider';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export async function apiRequest<T = any>(
  url: string,
  method: RequestMethod = 'GET',
  data?: any,
  auth?: AuthContextType
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  // Add auth token if available
  if (auth?.status === 'authenticated' && auth.user) {
    headers['Authorization'] = `Bearer ${auth.user.id}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Important for cookies to be sent
    cache: 'no-store',
  };

  if (data && method !== 'GET' && method !== 'HEAD') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (auth) {
          auth.signOut();
        }
        return {
          success: false,
          error: 'Your session has expired. Please log in again.',
          code: 'UNAUTHORIZED'
        };
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        return {
          success: false,
          error: 'You do not have permission to perform this action.',
          code: 'FORBIDDEN'
        };
      }

      // Handle other errors
      return {
        success: false,
        error: responseData.error || 'An error occurred',
        code: responseData.code || 'API_ERROR'
      };
    }

    return {
      success: true,
      data: responseData
    };
  } catch (error: unknown) {
    console.error('API request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      error: `${errorMessage}. Please check your connection and try again.`,
      code: 'NETWORK_ERROR'
    };
  }
}

// Helper functions for common HTTP methods
export const apiGet = <T = any>(url: string, auth?: AuthContextType) => 
  apiRequest<T>(url, 'GET', undefined, auth);

export const apiPost = <T = any>(url: string, data: any, auth?: AuthContextType) => 
  apiRequest<T>(url, 'POST', data, auth);

export const apiPut = <T = any>(url: string, data: any, auth?: AuthContextType) => 
  apiRequest<T>(url, 'PUT', data, auth);

export const apiDelete = <T = any>(url: string, auth?: AuthContextType) => 
  apiRequest<T>(url, 'DELETE', undefined, auth);

export const apiPatch = <T = any>(url: string, data: any, auth?: AuthContextType) => 
  apiRequest<T>(url, 'PATCH', data, auth);
