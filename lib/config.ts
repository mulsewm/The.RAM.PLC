// Client-side environment variables
type ClientEnv = {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_GA_TRACKING_ID?: string;
  NODE_ENV: 'development' | 'production' | 'test';
};

// Server-side environment variables
type ServerEnv = ClientEnv & {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
};

// Runtime environment (client or server)
const isClient = typeof window !== 'undefined';

// Get environment variables with type safety
export const env = {
  // Client-side env vars (prefixed with NEXT_PUBLIC_)
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
  
  // Server-side env vars (not exposed to client)
  ...(isClient ? {} : {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM || 'noreply@example.com',
  }),
} as const;

// Type guard to check if we're on the server
export const isServer = !isClient;

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && isServer) {
  const requiredVars: (keyof ServerEnv)[] = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
}

// Export types for use in other files
export type { ClientEnv, ServerEnv };
