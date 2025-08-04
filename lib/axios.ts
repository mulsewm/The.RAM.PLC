import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private instance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.authToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized (e.g., redirect to login)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (token === null && typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    const response = await this.instance.post('/auth/login', credentials);
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.instance.post('/users/register', userData);
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  logout() {
    this.setAuthToken(null);
    return this.instance.post('/auth/logout');
  }

  // User methods
  getCurrentUser() {
    return this.instance.get('/users/me');
  }

  // Partnership methods
  getPartnerships(params?: any) {
    return this.instance.get('/partnerships', { params });
  }

  getPartnership(id: string) {
    return this.instance.get(`/partnerships/${id}`);
  }

  createPartnership(data: any) {
    return this.instance.post('/partnerships', data);
  }

  updatePartnershipStatus(id: string, status: string, notes?: string) {
    return this.instance.patch(`/partnerships/${id}/status`, { status, notes });
  }

  addNoteToPartnership(partnershipId: string, content: string) {
    return this.instance.post(`/partnerships/${partnershipId}/notes`, { content });
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config);
  }
}

// Create a singleton instance
export const api = new ApiClient();

// Initialize auth token if exists in localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.setAuthToken(token);
  }
}

export default api;
