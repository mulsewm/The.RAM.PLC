import { AxiosError } from 'axios';

export class ApiError extends Error {
  statusCode: number;
  error: string;
  details?: any;

  constructor(message: string, statusCode: number, error: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
    
    // Ensure the error stack is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static fromAxiosError(error: AxiosError): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response;
      const responseData = data as any;
      
      return new ApiError(
        responseData?.message || error.message,
        status,
        responseData?.error || 'API_ERROR',
        responseData?.details
      );
    } else if (error.request) {
      // The request was made but no response was received
      return new ApiError(
        'No response received from server',
        0,
        'NETWORK_ERROR'
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return new ApiError(
        error.message || 'An unknown error occurred',
        0,
        'UNKNOWN_ERROR'
      );
    }
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      error: this.error,
      details: this.details,
    };
  }
}

// Helper function to handle API errors
export function handleApiError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error;
  } else if (error instanceof Error) {
    if ('isAxiosError' in error) {
      throw ApiError.fromAxiosError(error as any);
    }
    throw new ApiError(error.message, 500, 'INTERNAL_SERVER_ERROR');
  } else {
    throw new ApiError('An unknown error occurred', 500, 'UNKNOWN_ERROR');
  }
}

// Helper to create consistent error responses
export function createErrorResponse(
  message: string,
  statusCode: number,
  error: string,
  details?: any
) {
  return {
    success: false,
    error,
    message,
    ...(details && { details }),
  };
}

// Common error types
export const ERROR_TYPES = {
  // Authentication errors (1000-1099)
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation errors (1100-1199)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource errors (1200-1299)
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Permission errors (1300-1399)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Rate limiting & throttling (1400-1499)
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server errors (1500-1599)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Third-party service errors (1600-1699)
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // Business logic errors (1700-1799)
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  
  // Database errors (1800-1899)
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Network errors (1900-1999)
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const;

type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

export function getHttpStatusForError(errorType: ErrorType): number {
  const statusMap: Record<ErrorType, number> = {
    // Authentication errors
    [ERROR_TYPES.INVALID_CREDENTIALS]: 401,
    [ERROR_TYPES.UNAUTHORIZED]: 401,
    [ERROR_TYPES.INVALID_TOKEN]: 401,
    [ERROR_TYPES.TOKEN_EXPIRED]: 401,
    
    // Validation errors
    [ERROR_TYPES.VALIDATION_ERROR]: 400,
    [ERROR_TYPES.INVALID_INPUT]: 400,
    
    // Resource errors
    [ERROR_TYPES.NOT_FOUND]: 404,
    [ERROR_TYPES.ALREADY_EXISTS]: 409,
    
    // Permission errors
    [ERROR_TYPES.FORBIDDEN]: 403,
    [ERROR_TYPES.INSUFFICIENT_PERMISSIONS]: 403,
    
    // Rate limiting
    [ERROR_TYPES.TOO_MANY_REQUESTS]: 429,
    
    // Server errors
    [ERROR_TYPES.INTERNAL_SERVER_ERROR]: 500,
    [ERROR_TYPES.SERVICE_UNAVAILABLE]: 503,
    
    // Third-party service errors
    [ERROR_TYPES.EXTERNAL_SERVICE_ERROR]: 502,
    
    // Business logic errors
    [ERROR_TYPES.BUSINESS_RULE_VIOLATION]: 422,
    
    // Database errors
    [ERROR_TYPES.DATABASE_ERROR]: 500,
    
    // Network errors
    [ERROR_TYPES.NETWORK_ERROR]: 503,
    [ERROR_TYPES.TIMEOUT]: 504,
    
    // Generic errors
    [ERROR_TYPES.UNKNOWN_ERROR]: 500,
    [ERROR_TYPES.NOT_IMPLEMENTED]: 501,
  };
  
  return statusMap[errorType] || 500;
}
