import { ZodError } from 'zod';

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Maintain proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export class ValidationError extends ApiError {
  constructor(errors: any) {
    super('Validation failed', 400, 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends ApiError {
  constructor() {
    super('Internal server error', 500, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

export function handleError(error: unknown): { status: number; data: any } {
  console.error('Error handler caught:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
    );
    return {
      status: validationError.statusCode,
      data: validationError.toJSON(),
    };
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      data: error.toJSON(),
    };
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    switch ((error as any).code) {
      case 'P2002':
        return {
          status: 409,
          data: {
            success: false,
            error: 'A resource with this identifier already exists',
            code: 'DUPLICATE_ENTRY',
            details: (error as any).meta?.target,
          },
        };
      case 'P2025':
        return {
          status: 404,
          data: {
            success: false,
            error: 'The requested resource was not found',
            code: 'NOT_FOUND',
          },
        };
    }
  }

  // Handle other unexpected errors
  const internalError = new InternalServerError();
  return {
    status: internalError.statusCode,
    data: internalError.toJSON(),
  };
}

export function errorResponse(error: unknown) {
  const { status, data } = handleError(error);
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
