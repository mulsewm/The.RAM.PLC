import pino from 'pino';
import { env } from '../config';

// Types
type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

type LogContext = Record<string, unknown> & {
  error?: Error | unknown;
  stack?: string;
};

// Configure the logger
const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: env.NODE_ENV === 'development' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          levelFirst: true,
          singleLine: true,
          errorProps: 'code,stack',
        },
      }
    : undefined,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  base: {
    env: env.NODE_ENV,
  },
  redact: {
    paths: [
      'password',
      '*.password',
      '*.passwordConfirmation',
      '*.token',
      '*.accessToken',
      '*.refreshToken',
      '*.authorization',
      '*.cookie',
    ],
    remove: true,
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.fatal(
    { error: { message: error.message, stack: error.stack } },
    'Uncaught Exception - This is bad, process will exit!'
  );
  
  // Give logs time to be written before exiting
  setTimeout(() => process.exit(1), 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  let errorMessage = 'Unhandled Rejection at Promise';
  let errorStack: string | undefined;
  
  if (reason instanceof Error) {
    errorMessage = reason.message;
    errorStack = reason.stack;
  } else if (typeof reason === 'string') {
    errorMessage = reason;
  }
  
  logger.fatal(
    { error: { message: errorMessage, stack: errorStack }, promise },
    'Unhandled Rejection - This is bad, process will exit!'
  );
  
  // Give logs time to be written before exiting
  setTimeout(() => process.exit(1), 1000);
});

// Handle process termination
process.on('SIGTERM', () => {
  logger.info('SIGTERM received - Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received - Shutting down gracefully');
  process.exit(0);
});

// Request logging middleware
export const requestLogger = (req: any, res: any, next: () => void) => {
  const start = Date.now();
  const { method, url, headers, query, body } = req;
  
  // Skip logging for health checks and static assets
  if (url === '/health' || url.startsWith('/_next/') || url.includes('favicon.ico')) {
    return next();
  }

  // Log request details
  logger.info({
    type: 'request',
    method,
    url,
    query,
    body,
    headers: {
      'user-agent': headers['user-agent'],
      referer: headers.referer,
      'x-forwarded-for': headers['x-forwarded-for'],
      'x-request-id': headers['x-request-id'],
    },
  }, `${method} ${url} - Request started`);

  // Log response details when the request is complete
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? 'error' : 
                     res.statusCode >= 400 ? 'warn' : 'info';
    
    const logContext = {
      type: 'response',
      method,
      url,
      status: res.statusCode,
      duration: `${duration}ms`,
      'response-time': `${duration}ms`,
      'content-length': res.get('content-length'),
    };

    logger[logLevel](logContext, `${method} ${url} - ${res.statusCode} (${duration}ms)`);
  });

  // Log any errors that occur during request handling
  res.on('error', (error: Error) => {
    logger.error({
      type: 'request-error',
      method,
      url,
      error: {
        message: error.message,
        stack: error.stack,
      },
    }, 'Request error');
  });

  next();
};

// Structured logging methods
export const log = {
  // Log an info message
  info: (message: string, context?: LogContext) => {
    logger.info(context || {}, message);
  },
  
  // Log an error
  error: (message: string, errorOrContext?: Error | LogContext, context?: LogContext) => {
    if (errorOrContext instanceof Error) {
      const { message: errorMessage, stack, ...rest } = errorOrContext as any;
      logger.error({
        ...context,
        error: {
          message: errorMessage,
          stack,
          ...rest,
        },
      }, message);
    } else {
      logger.error(errorOrContext || {}, message);
    }
  },
  
  // Log a warning
  warn: (message: string, context?: LogContext) => {
    logger.warn(context || {}, message);
  },
  
  // Log debug information
  debug: (message: string, context?: LogContext) => {
    logger.debug(context || {}, message);
  },
  
  // Log trace information
  trace: (message: string, context?: LogContext) => {
    logger.trace(context || {}, message);
  },
  
  // For critical errors that require immediate attention
  fatal: (message: string, error?: Error, context?: LogContext) => {
    if (error) {
      logger.fatal({
        ...context,
        error: {
          message: error.message,
          stack: error.stack,
          ...(error as any).code && { code: (error as any).code },
          ...(error as any).statusCode && { statusCode: (error as any).statusCode },
        },
      }, message);
    } else {
      logger.fatal(context || {}, message);
    }
  },
  
  // Create a child logger with additional context
  child: (bindings: Record<string, unknown>) => {
    return logger.child(bindings);
  },
  
  // Check if a log level is enabled
  isLevelEnabled: (level: LogLevel): boolean => {
    return logger.isLevelEnabled(level);
  },
};

export default logger;
