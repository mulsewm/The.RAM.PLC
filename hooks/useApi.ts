import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiError, handleApiError } from '@/lib/error';

// Generic type for API response
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// Generic type for paginated response
type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// Generic type for list params
type ListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
};

// Create a generic query hook
const useApiQuery = <T>(
  key: string | any[],
  url: string,
  params?: any,
  options: Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: Array.isArray(key) ? key : [key, params],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<T>>(url, { params });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    ...options,
  });
};

// Create a generic mutation hook
const useApiMutation = <T, V = any>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options: {
    onSuccess?: (data: ApiResponse<T>) => void;
    onError?: (error: ApiError) => void;
    invalidateQueries?: string[] | ((data: ApiResponse<T>) => string[]);
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn: async (data) => {
      try {
        const response = await api[method]<ApiResponse<T>>(url, data);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        const queries = typeof options.invalidateQueries === 'function'
          ? options.invalidateQueries(data)
          : options.invalidateQueries;
        
        queries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      
      // Call custom onSuccess
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('API Error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

// Auth hooks
export const useLogin = () => {
  const { onSuccess, onError } = useAuthCallbacks();
  
  return useApiMutation<{ user: any; token: string }, { email: string; password: string }>(
    'post',
    '/auth/login',
    {
      onSuccess: (data) => {
        // Handle successful login (e.g., store token, redirect)
        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
        }
        onSuccess(data);
      },
      onError,
    }
  );
};

export const useRegister = () => {
  const { onSuccess, onError } = useAuthCallbacks();
  
  return useApiMutation<{ user: any; token: string }, { name: string; email: string; password: string }>(
    'post',
    '/users/register',
    {
      onSuccess: (data) => {
        // Handle successful registration (e.g., store token, redirect)
        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
        }
        onSuccess(data);
      },
      onError,
    }
  );
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>('post', '/auth/logout', {
    onSuccess: () => {
      // Clear auth state
      localStorage.removeItem('token');
      
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login
      window.location.href = '/login';
    },
  });
};

export const useCurrentUser = () => {
  return useApiQuery<{ user: any }>('currentUser', '/users/me', undefined, {
    enabled: !!localStorage.getItem('token'),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Partnership hooks
export const usePartnerships = (params?: ListParams) => {
  return useApiQuery<PaginatedResponse<any>>('partnerships', '/partnerships', params);
};

export const usePartnership = (id: string) => {
  return useApiQuery<any>(['partnership', id], `/partnerships/${id}`);
};

export const useCreatePartnership = () => {
  return useApiMutation<any, any>('post', '/partnerships', {
    invalidateQueries: ['partnerships'],
  });
};

export const useUpdatePartnership = (id: string) => {
  return useApiMutation<any, any>('put', `/partnerships/${id}`, {
    invalidateQueries: ['partnerships', ['partnership', id]],
  });
};

export const useDeletePartnership = () => {
  return useApiMutation<void, string>('delete', (id) => `/partnerships/${id}`, {
    invalidateQueries: ['partnerships'],
  });
};

// Helper hook for auth callbacks
const useAuthCallbacks = () => {
  const router = useRouter();
  
  const onSuccess = (data: any) => {
    // Redirect to dashboard or intended URL
    const redirectTo = router.query.redirect || '/dashboard';
    router.push(redirectTo as string);
  };
  
  const onError = (error: ApiError) => {
    // Show error toast or handle error
    console.error('Auth error:', error);
  };
  
  return { onSuccess, onError };
};

export { useApiQuery, useApiMutation };
