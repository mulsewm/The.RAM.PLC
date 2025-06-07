import { z } from 'zod';
import { env as processEnv } from 'process';

// Type definitions
type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
type NodeEnv = 'development' | 'test' | 'production';

// Schema for environment variables
const configSchema = z.object({
  // Server configuration
  NODE_ENV: z
    .enum(['development', 'test', 'production'] as const)
    .default('development' as const)
    .transform((val) => val as NodeEnv),
  
  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10)),
    
  HOST: z.string().default('0.0.0.0'),
  
  // Database configuration
  DATABASE_URL: z.string().min(1, 'Database connection string is required'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .default('587')
    .transform((val) => parseInt(val, 10)),
    
  SMTP_SECURE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
    
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM_NAME: z.string().default('The RAM PLC'),
  EMAIL_FROM_ADDRESS: z
    .string()
    .email('Invalid email address')
    .default('noreply@theramplc.com'),
  
  // Logging
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const)
    .default('info' as const)
    .transform((val) => val as LogLevel),
  
  // API configuration
  API_PREFIX: z.string().default('/api'),
  API_VERSION: z.string().default('1'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default('900000') // 15 minutes
    .transform((val) => parseInt(val, 10)),
    
  RATE_LIMIT_MAX: z
    .string()
    .default('100')
    .transform((val) => parseInt(val, 10)),
  
  // Session
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  SESSION_COOKIE_NAME: z.string().default('__Secure-session-token'),
  SESSION_COOKIE_DOMAIN: z.string().optional(),
  SESSION_COOKIE_PATH: z.string().default('/'),
  SESSION_COOKIE_SECURE: z
    .string()
    .default('true')
    .transform((val) => val !== 'false'),
    
  SESSION_COOKIE_HTTP_ONLY: z
    .string()
    .default('true')
    .transform((val) => val !== 'false'),
    
  SESSION_COOKIE_SAME_SITE: z
    .enum(['lax', 'strict', 'none'] as const)
    .default('lax' as const),
    
  SESSION_MAX_AGE: z
    .string()
    .default('2592000') // 30 days
    .transform((val) => parseInt(val, 10)),
  
  // Feature flags
  ENABLE_EMAIL: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
    
  MAINTENANCE_MODE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  
  // Security headers
  SECURITY_HEADERS: z
    .string()
    .default('1')
    .transform((val) => val !== '0'),
  
  // Sentry
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),
  
  // Application info
  APP_VERSION: z.string().default('1.0.0'),
  BUILD_NUMBER: z.string().optional(),
  BUILD_TIMESTAMP: z.string().optional(),
  
  // Debug mode
  DEBUG: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
});

// Validate the environment variables
const parseConfig = (env: NodeJS.ProcessEnv) => {
  try {
    return configSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      
      console.error('❌ Invalid environment variables:', JSON.stringify(errors, null, 2));
      process.exit(1);
    }
    
    console.error('❌ Failed to parse environment variables:', error);
    process.exit(1);
  }
};

// Parse and validate the environment variables
const env = parseConfig(process.env);

// Export the validated environment variables
export { env };

// Export the config schema for documentation
export { configSchema };

// Export types
export type { LogLevel, NodeEnv };
export type Config = z.infer<typeof configSchema>;

// Helper functions for type-safe environment variable access
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Log the current environment (except in test)
if (process.env.NODE_ENV !== 'test') {
  console.log(`🚀 Environment: ${env.NODE_ENV}`);
  console.log(`🌐 Host: ${env.HOST}:${env.PORT}`);
  console.log(`🔒 Security Headers: ${env.SECURITY_HEADERS ? 'enabled' : 'disabled'}`);
  console.log(`📧 Email Enabled: ${env.ENABLE_EMAIL}`);
  
  if (env.MAINTENANCE_MODE) {
    console.warn('⚠️  MAINTENANCE MODE ENABLED');
  }
}
