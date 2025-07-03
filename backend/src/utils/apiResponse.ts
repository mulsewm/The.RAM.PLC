import { Response } from 'express';

export interface ApiResponseData<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static error<T>(res: Response, message: string, statusCode = 400, error?: any): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }

  static notFound<T>(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static unauthorized<T>(res: Response, message = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  static forbidden<T>(res: Response, message = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  static badRequest<T>(res: Response, message = 'Bad request'): Response {
    return this.error(res, message, 400);
  }

  static internalError<T>(res: Response, message = 'Internal server error', error?: any): Response {
    return this.error(res, message, 500, error);
  }

  static validationError<T>(res: Response, errors: any[], message = 'Validation failed'): Response {
    return this.error(res, message, 400, { errors });
  }
}
