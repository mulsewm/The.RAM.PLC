import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { User, UserRole } from '@prisma/client';
import { ApiError, UnauthorizedError, ForbiddenError } from './error-handler';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

interface TokenPayload {
  sub: string;
  role: UserRole;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export async function generateTokens(user: User) {
  const accessToken = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return { accessToken, refreshToken };
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string | null
): Promise<boolean> {
  if (!hashedPassword) return false;
  return compare(password, hashedPassword);
}

export function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
): NextResponse {
  // Set access token in HTTP-only cookie
  response.cookies.set({
    name: 'access_token',
    value: tokens.accessToken,
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 hour
  });

  // Set refresh token in HTTP-only cookie
  response.cookies.set({
    name: 'refresh_token',
    value: tokens.refreshToken,
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  // Clear access token
  response.cookies.set({
    name: 'access_token',
    value: '',
    ...COOKIE_OPTIONS,
    maxAge: 0, // Expire immediately
  });

  // Clear refresh token
  response.cookies.set({
    name: 'refresh_token',
    value: '',
    ...COOKIE_OPTIONS,
    maxAge: 0, // Expire immediately
  });

  return response;
}

export async function getCurrentUser(
  request?: NextRequest
): Promise<{ user: User | null; session: TokenPayload | null }> {
  try {
    // Get token from cookies or Authorization header
    let token: string | null = null;
    
    if (request) {
      // Try to get from cookies first
      token = request.cookies.get('access_token')?.value || null;
      
      // Fallback to Authorization header
      if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }
    } else {
      // Server-side without request object (e.g., in API routes using cookies())
      token = cookies().get('access_token')?.value || null;
    }

    if (!token) return { user: null, session: null };

    // Verify the token
    const payload = await verifyToken(token);
    
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return { user, session: payload };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, session: null };
  }
}

export async function requireAuth(
  request: NextRequest,
  roles: UserRole[] = []
): Promise<{ user: User; session: TokenPayload }> {
  const { user, session } = await getCurrentUser(request);

  if (!user || !session) {
    throw new UnauthorizedError('Authentication required');
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new ForbiddenError('Insufficient permissions');
  }

  return { user, session };
}

export function generatePasswordResetToken(): { token: string; expires: Date } {
  const token = randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // 1 hour expiry

  return { token, expires };
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  // In a real app, you would send an email with a reset link
  // For now, we'll just log it
  console.log(`Password reset link for ${email}: /reset-password?token=${token}`);
  
  // Example using a mock email service:
  /*
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    html: `Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">here</a> to reset your password.`,
  });
  */
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<void> {
  const hashedPassword = await hashPassword(newPassword);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

// Middleware to protect API routes
export async function apiAuthMiddleware(
  request: NextRequest,
  roles: UserRole[] = []
) {
  try {
    const { user } = await requireAuth(request, roles);
    return { user };
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    
    console.error('API auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

// Helper to check if a user has the required role
export function hasRole(user: User, requiredRoles: UserRole[]): boolean {
  if (!user?.role) return false;
  if (requiredRoles.length === 0) return true;
  return requiredRoles.includes(user.role);
}

// Helper to get the highest role a user has
export function getUserHighestRole(user: User): UserRole {
  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  return (Object.entries(roleHierarchy)
    .sort((a, b) => b[1] - a[1])
    .find(([role]) => user.role === role)?.[0] || 'USER') as UserRole;
}
