import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
];

// Define admin paths that require admin role
const adminPaths = [
  '/admin',
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const authToken = request.cookies.get('auth_token');

  // Redirect any login attempts with credentials in URL to clean login page
  if (pathname === '/login' && (searchParams.has('email') || searchParams.has('password'))) {
    const from = searchParams.get('from');
    const cleanUrl = new URL('/login', request.url);
    if (from) {
      cleanUrl.searchParams.set('from', from);
    }
    return NextResponse.redirect(cleanUrl);
  }

  // Skip middleware for public paths, static files, and API routes that handle their own auth
  if (publicPaths.some(path => pathname.startsWith(path)) || 
      pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/)) {
    return NextResponse.next();
  }

  // If no token and trying to access protected route
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    // Only set the 'from' parameter for non-API routes
    if (!pathname.startsWith('/api/')) {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(authToken.value, secret);

    // If user is authenticated and tries to access login/register
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Check if user is trying to access admin route without admin role
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
    if (isAdminPath && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
