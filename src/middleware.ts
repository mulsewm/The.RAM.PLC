import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/_vercel',
  '/public',
  '/images',
  '/error',
  '/unauthorized'
];

// Routes that require authentication but are not admin-specific
const AUTH_ROUTES = [
  '/dashboard',
  '/account',
  '/api/user',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
  '/users',
  '/api/users'
];

// Routes that should be accessible even when logged in
const GUEST_ONLY_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/auth/[...nextauth]',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/error',
  '/api/auth/verify-request',
  '/api/auth/_log'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith('/api/');
  const response = NextResponse.next();

  try {
    // Skip middleware for public routes
    const isPublicRoute = PUBLIC_ROUTES.some(route => {
      if (route.endsWith('*')) {
        return pathname.startsWith(route.slice(0, -1));
      }
      return pathname === route || pathname.startsWith(`${route}/`);
    });

    // Skip middleware for public API routes
    const isPublicApiRoute = isApiRoute && 
      (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route)) ||
       pathname.includes('/_next') ||
       pathname.includes('/static'));

    if (isPublicRoute || isPublicApiRoute) {
      return response;
    }

    // Get the session token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Handle guest-only routes (like login, register)
    const isGuestRoute = GUEST_ONLY_ROUTES.some(route => pathname.startsWith(route));
    if (isGuestRoute) {
      if (token) {
        // If user is logged in, redirect to dashboard
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      }
      return response; // Allow access to guest routes
    }

    // Check if user is authenticated
    if (!token) {
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({ 
            success: false, 
            error: 'Authentication required',
            code: 'UNAUTHORIZED'
          }), 
          { 
            status: 401, 
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, max-age=0'
            } 
          }
        );
      }
      
      // For non-API routes, redirect to login with callback URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
    const isAdmin = token.role === 'ADMIN' || token.role === 'SUPER_ADMIN';
    
    if (isAdminRoute && !isAdmin) {
      if (isApiRoute) {
        return new NextResponse(
          JSON.stringify({ 
            success: false,
            error: 'Insufficient permissions',
            code: 'FORBIDDEN'
          }), 
          { 
            status: 403, 
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, max-age=0'
            } 
          }
        );
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add security headers to all responses
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('Cache-Control', 'no-store, max-age=0');

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          error: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        }), 
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          } 
        }
      );
    }
    
    // For non-API routes, redirect to error page
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('message', 'An unexpected error occurred');
    return NextResponse.redirect(errorUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
