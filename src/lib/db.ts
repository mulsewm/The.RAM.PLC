import { PrismaClient, Prisma } from '@prisma/client';
import { env } from '../config';
import { log } from './logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Custom error class for database errors
export class DatabaseError extends Error {
  code: string;
  meta?: Record<string, unknown>;
  statusCode: number;
  
  constructor(
    message: string, 
    { code, meta, statusCode = 500 }: { 
      code: string; 
      meta?: Record<string, unknown>; 
      statusCode?: number 
    }
  ) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.meta = meta;
    this.statusCode = statusCode;
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
}

// Format Prisma errors into a more user-friendly format
const formatPrismaError = (error: unknown): Error => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known request errors
    return new DatabaseError(error.message, {
      code: error.code,
      meta: error.meta,
      statusCode: 400, // Bad Request
    });
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Handle validation errors
    return new DatabaseError('Database validation failed', {
      code: 'P2002',
      meta: { message: error.message },
      statusCode: 400, // Bad Request
    });
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Handle unknown request errors
    return new DatabaseError('An unknown database error occurred', {
      code: 'P5000',
      statusCode: 500, // Internal Server Error
    });
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // Handle Rust panic errors
    return new DatabaseError('A database panic occurred', {
      code: 'P5001',
      statusCode: 500, // Internal Server Error
    });
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // Handle initialization errors
    return new DatabaseError('Failed to initialize database connection', {
      code: 'P5002',
      statusCode: 503, // Service Unavailable
    });
  // Removed PrismaClientRustError as it's not a valid Prisma error type
  } else if (error instanceof Error) {
    // Handle generic errors
    return error;
  }
  
  // Fallback for unknown errors
  return new DatabaseError('An unknown database error occurred', {
    code: 'UNKNOWN_ERROR',
    statusCode: 500, // Internal Server Error
  });
};

// Create a new PrismaClient instance or reuse the existing one in development
const prisma: PrismaClient = global.prisma || new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
  ],
});

// Log Prisma events
prisma.$on('query' as never, (e: any) => {
  log.debug('Database Query', {
    query: e.query,
    params: e.params,
    duration: e.duration,
    timestamp: e.timestamp,
  });
});

prisma.$on('info' as never, (e: any) => {
  log.info('Database Info', { message: e.message });
});

prisma.$on('warn' as never, (e: any) => {
  log.warn('Database Warning', { message: e.message });
});

prisma.$on('error' as never, (e: any) => {
  log.error('Database Error', { 
    message: e.message,
    target: e.target,
  });
});

// Middleware for error handling
prisma.$use(async (params, next) => {
  const start = Date.now();
  let result;
  
  try {
    result = await next(params);
  } catch (error) {
    // Log the error and rethrow a formatted error
    const formattedError = formatPrismaError(error);
    log.error('Database operation failed', {
      model: params.model,
      action: params.action,
      error: formattedError,
    });
    throw formattedError;
  }
  
  const duration = Date.now() - start;
  
  // Log slow queries
  if (duration > 2000) { // 2 seconds
    log.warn('Slow Query', {
      model: params.model,
      action: params.action,
      duration: `${duration}ms`,
      args: JSON.stringify(params.args),
    });
  }
  
  return result;
});

// Handle process termination to close the Prisma client
const shutdown = async () => {
  log.info('Shutting down database connection...');
  await prisma.$disconnect();
  log.info('Database connection closed');
};

process.on('beforeExit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Store the Prisma client in the global object in development
// to prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Helper function to handle Prisma errors
export const handlePrismaError = (error: unknown) => {
  const formattedError = formatPrismaError(error);
  log.error('Database operation failed', formattedError);
  throw formattedError;
};

export default prisma;
