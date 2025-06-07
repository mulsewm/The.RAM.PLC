import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAfter: number;
  retryAfter?: number;
  error?: string;
};

export class RateLimitError extends Error {
  statusCode: number;
  retryAfter: number;
  
  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429; // Too Many Requests
    this.retryAfter = retryAfter;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RateLimitError);
    }
  }
}

export const rateLimit = (options?: Options) => {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // Default: 1 minute
  });

  return {
    check: async (request: NextRequest, limit: number, token?: string): Promise<RateLimitResult> => {
      // Get IP from headers (handled by Next.js middleware)
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(/, /)[0] : '127.0.0.1';
      
      const tokenKey = token || ip;
      const currentTime = Date.now();

      // Get timestamps for the current token
      const tokenTimestamps = tokenCache.get(tokenKey) || [];
      
      // Remove timestamps older than the interval
      const windowStart = currentTime - (options?.interval || 60000);
      const requestsInWindow = tokenTimestamps.filter(ts => ts > windowStart);

      // Calculate rate limit info
      const remaining = Math.max(0, limit - requestsInWindow.length);
      const resetAfter = (options?.interval || 60000) - (currentTime - windowStart);

      // If we have too many requests, throw an error
      if (requestsInWindow.length >= limit) {
        const oldestRequest = requestsInWindow[0];
        const retryAfter = Math.ceil((oldestRequest + (options?.interval || 60000) - currentTime) / 1000);
        
        throw new RateLimitError(
          `Too many requests, please try again in ${retryAfter} seconds`,
          retryAfter
        );
      }

      // Add current timestamp and update cache
      tokenTimestamps.push(currentTime);
      tokenCache.set(tokenKey, tokenTimestamps);

      return {
        success: true,
        limit,
        remaining,
        resetAfter,
      };
    },
  };
};

// Global rate limiter instance
export const globalRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000, // 1000 users per interval
});

// Middleware for API routes
export const withRateLimit = (handler: Function, limit = 10, windowMs = 60000) => {
  const limiter = rateLimit({
    interval: windowMs,
    uniqueTokenPerInterval: 1000,
  });

  return async (req: NextRequest, ...args: any[]) => {
    try {
      await limiter.check(req, limit);
      return handler(req, ...args);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({ 
            error: 'Too many requests',
            message: error.message,
            retryAfter: error.retryAfter 
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': error.retryAfter.toString(),
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + error.retryAfter).toString(),
            },
          }
        );
      }
      throw error;
    }
  };
};
