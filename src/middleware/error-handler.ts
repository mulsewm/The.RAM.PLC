import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseError } from '../lib/db';

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

export const withErrorHandler = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof DatabaseError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      }
      
      // Handle other types of errors
      const statusCode = (error as any).statusCode || 500;
      const message = (error as Error).message || 'Internal Server Error';
      
      res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: (error as Error).stack }),
      });
    }
  };
};

// Global error handler for uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}
