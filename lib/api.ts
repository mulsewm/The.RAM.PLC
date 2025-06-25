import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

type ApiResponse<T = any> = {
  data: T;
  message?: string;
  success: boolean;
};

type RequestConfig = Omit<AxiosRequestConfig, 'headers'> & {
  headers?: Record<string, string>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private authToken: string | null = null;

  private constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.initAuthToken();
    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private initAuthToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) this.setAuthToken(token);
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.authToken}`,
        };
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.setAuthToken(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window === 'undefined') return;

    if (token) {
      localStorage.setItem('token', token);
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Generic HTTP Methods
  public async get<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const res = await this.client.get<ApiResponse<T>>(url, config);
    return res.data;
  }

  public async post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const res = await this.client.post<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  public async put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const res = await this.client.put<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  public async delete<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const res = await this.client.delete<ApiResponse<T>>(url, config);
    return res.data;
  }

  public async patch<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const res = await this.client.patch<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  // Authentication
  public async login(credentials: { email: string; password: string }) {
    const res = await this.post('/auth/login', credentials);
    if (res.data.token) this.setAuthToken(res.data.token);
    return res.data;
  }

  public async register(userData: { name: string; email: string; password: string }) {
    const res = await this.post('/users/register', userData);
    if (res.data.token) this.setAuthToken(res.data.token);
    return res.data;
  }

  public logout() {
    this.setAuthToken(null);
    return this.post('/auth/logout');
  }

  public getCurrentUser() {
    return this.get('/users/me');
  }

  // Partnerships
  public getPartnerships(params?: any) {
    return this.get('/partnerships', { params });
  }

  public getPartnership(id: string) {
    return this.get(`/partnerships/${id}`);
  }

  public createPartnership(data: any) {
    return this.post('/partnerships', data);
  }

  public updatePartnershipStatus(id: string, status: string, notes?: string) {
    return this.patch(`/partnerships/${id}/status`, { status, notes });
  }

  public addNoteToPartnership(id: string, content: string) {
    return this.post(`/partnerships/${id}/notes`, { content });
  }

  // Direct Axios Access
  public request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request(config);
  }
}

const api = ApiClient.getInstance();
export { api };
export default api;
