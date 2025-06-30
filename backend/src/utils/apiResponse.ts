import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    });
  }

  static error(res: Response, message: string, statusCode = 400, error?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }

  static notFound(res: Response, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return this.error(res, message, 403);
  }
}
