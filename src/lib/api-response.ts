import { NextResponse } from 'next/server';
import { z } from 'zod';
import { log } from './logger';

type SuccessResponseData<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

type ErrorResponseData = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type ApiResponse<T = unknown> = SuccessResponseData<T> | ErrorResponseData;

// Helper functions for creating responses
const createSuccessResponse = <T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200
): NextResponse<SuccessResponseData<T>> => {
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
};

const createErrorResponse = (
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ErrorResponseData> => {
  log.error('API Error', { code, message, status, details });
  
  const response: ErrorResponseData = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  
  return NextResponse.json(response, { status });
};

// Common response helpers
export const notFoundResponse = (resource = 'Resource') => 
  createErrorResponse('NOT_FOUND', `${resource} not found`, 404);

export const unauthorizedResponse = (message = 'Unauthorized') =>
  createErrorResponse('UNAUTHORIZED', message, 401);

export const forbiddenResponse = (message = 'Forbidden') =>
  createErrorResponse('FORBIDDEN', message, 403);

export const badRequestResponse = (message = 'Bad Request', details?: unknown) =>
  createErrorResponse('BAD_REQUEST', message, 400, details);

export const serverErrorResponse = (error?: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
  
  return createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred',
    500,
    process.env.NODE_ENV === 'development' ? errorMessage : undefined
  );
};

export const validationErrorResponse = (error: z.ZodError) => {
  const formattedErrors = error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message,
  }));
  
  return badRequestResponse(
    'Validation failed',
    { errors: formattedErrors }
  );
};

// Pagination helper
export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  meta?: Record<string, unknown>
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  
  return createSuccessResponse(
    data,
    {
      ...meta,
      pagination: {
        total,
        totalPages,
        page,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    }
  );
};

// Type guards
export const isSuccessResponse = <T>(
  response: ApiResponse<T>
): response is SuccessResponseData<T> => response.success === true;

export const isErrorResponse = (
  response: ApiResponse
): response is ErrorResponseData => response.success === false;

// API route handler helper
export const handleApiRoute = async <T>(
  handler: () => Promise<T>,
  successStatus = 200
) => {
  try {
    const data = await handler();
    return createSuccessResponse(data, undefined, successStatus);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error);
    }
    
    if (error instanceof Error) {
      if (error.name === 'NotFoundError') {
        return notFoundResponse(error.message);
      }
      
      if (error.name === 'UnauthorizedError') {
        return unauthorizedResponse(error.message);
      }
      
      if (error.name === 'ForbiddenError') {
        return forbiddenResponse(error.message);
      }
      
      if (error.name === 'ValidationError') {
        return badRequestResponse(error.message);
      }
      
      log.error('Unhandled API error', { error });
      return serverErrorResponse(error);
    }
    
    log.error('Unknown API error', { error });
    return serverErrorResponse();
  }
};

// Pagination helper
export const getPagination = (page: number, limit: number) => {
  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(limit) || 10));
  const skip = (pageNumber - 1) * pageSize;
  
  return {
    skip,
    take: pageSize,
    page: pageNumber,
    limit: pageSize,
  };
};

// Parse query parameters with defaults
export function parseQueryParams(
  searchParams: URLSearchParams,
  options: {
    page?: {
      default?: number;
      min?: number;
    };
    limit?: {
      default?: number;
      min?: number;
      max?: number;
    };
  } = {}
) {
  const page = Math.max(
    options.page?.min || 1,
    parseInt(searchParams.get('page') || `${options.page?.default || 1}`) || 1
  );

  const limit = Math.min(
    Math.max(
      options.limit?.min || 1,
      parseInt(searchParams.get('limit') || `${options.limit?.default || 10}`) || 10
    ),
    options.limit?.max || 100
  );

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    search,
    sort,
    order,
  };
}

// Format pagination metadata
export function formatPagination(
  total: number,
  page: number,
  limit: number,
  baseUrl: string
) {
  const totalPages = Math.ceil(total / limit);
  
  const query = new URLSearchParams();
  Array.from(new URL(baseUrl).searchParams.entries())
    .filter(([key]) => !['page', 'limit'].includes(key))
    .forEach(([key, value]) => query.append(key, value));
  
  const generatePageUrl = (p: number) => {
    const q = new URLSearchParams(query);
    q.set('page', p.toString());
    q.set('limit', limit.toString());
    return `${baseUrl.split('?')[0]}?${q.toString()}`;
  };
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPageUrl: page < totalPages ? generatePageUrl(page + 1) : null,
    previousPageUrl: page > 1 ? generatePageUrl(page - 1) : null,
    firstPageUrl: total > 0 ? generatePageUrl(1) : null,
    lastPageUrl: total > 0 ? generatePageUrl(totalPages) : null,
  };
}
