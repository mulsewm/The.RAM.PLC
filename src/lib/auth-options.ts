import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient, Role, User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { AuthOptions, DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';
import { NextApiRequest, NextApiResponse } from 'next';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
      image?: string | null;
      emailVerified?: Date | null;
      lastLogin?: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    image?: string | null;
    emailVerified?: Date | null;
    active?: boolean;
    lastLogin?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    email: string;
    name?: string | null;
    picture?: string | null;
  }
}

const prisma = new PrismaClient();

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          throw new Error('No user found with this email');
        }
        
        if (!user.active) {
          throw new Error('User account is not active');
        }
        
        const isValid = await compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('Invalid password');
        }
        
        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        });
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
          lastLogin: user.lastLogin
        };

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        if (!user.active) {
          throw new Error('Your account has been deactivated');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Add user ID and role to the session
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session timestamp if user is active within 24 hours
  },
  
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
  
  // Cookie configuration
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      },
    },
  },
  
  // Security settings
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key', // Fallback for development
  debug: process.env.NODE_ENV === 'development',
  
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-jwt-secret',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Trust the host header in development
  // Using type assertion to bypass TypeScript error for trustHost
  ...(process.env.NODE_ENV !== 'production' ? { trustHost: true } : {}),
  
  // Pages configuration
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/login',
    newUser: '/onboarding',
  },
  
  // Events and logging
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Handle successful sign in
      console.log('User signed in:', user.email);
    },
    async signOut({ session, token }) {
      // Handle user sign out
      console.log('User signed out');
    },
  },
  
  // Logger configuration
  logger: {
    error(code: string, metadata: unknown) {
      console.error('Auth error:', { code, metadata });
    },
    warn(code: string) {
      console.warn('Auth warning:', code);
    },
    debug(code: string, metadata: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth debug:', { code, metadata });
      }
    },
  }
};
