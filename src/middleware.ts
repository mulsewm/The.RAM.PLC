import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of allowed origins (update this with your frontend URL)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://your-production-domain.com',
];

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/[...nextauth]',
  '/api/auth/session',
  '/api/test',
  '/api/status',
  '/api/health',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
];

// List of admin paths that require admin role
const adminPaths = ['/admin'];

// List of auth paths that should only be accessible to guests
const guestOnlyPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// List of API routes that should be handled by the middleware
const apiRoutes = [
  '/api/auth/[...nextauth]',
  '/api/auth/session',
  '/api/test',
  '/api/status',
  '/api/health',
];

// List of API routes that should bypass middleware completely
const bypassApiRoutes = [
  '/api/auth/[...nextauth]',
  '/api/session',
  '/api/auth/session',
  '/api/test',
  '/api/status',
  '/api/health',
];

// Skip middleware for these specific API routes and static files
const skipMiddlewareForApiRoutes = [
  ...bypassApiRoutes,  // Include all bypass routes in skip list
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
];

// Check if a path should skip middleware
const shouldSkipMiddleware = (pathname: string): boolean => {
  return skipMiddlewareForApiRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`)
  );
};

// Helper to check if the origin is allowed
const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  return allowedOrigins.some(allowedOrigin => 
    origin === allowedOrigin || 
    origin.startsWith(`${allowedOrigin}/`)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  const isAllowed = isAllowedOrigin(origin);
  
  // Create a response object that we'll modify as needed
  let response = NextResponse.next();

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Length': '0'
      }
    });
  }

  // Add CORS headers to all responses
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  // Skip middleware for specific API routes by returning early
  if (shouldSkipMiddleware(pathname)) {
    // For these API routes, just return the response with CORS headers
    return response;
  }

  // For non-API routes, check authentication and authorization
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  const isGuestOnlyPath = guestOnlyPaths.some(path => pathname.startsWith(path));

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    });
  }

  // Skip middleware for public paths and static files
  if (isPublicPath || pathname.startsWith('/_next/') || pathname.endsWith('.ico')) {
    return response;
  }

  // Handle other API routes that need authentication
  if (pathname.startsWith('/api/')) {
    // For protected API routes, check authentication if not public
    if (!isPublicPath) {
      type SessionToken = { role?: string; [key: string]: any } | null;
      const session = await getToken({ req: request }) as SessionToken;
      
      if (!session) {
        const headers = new Headers({
          'Content-Type': 'application/json',
          ...(isAllowed ? { 'Access-Control-Allow-Origin': origin || '*' } : {})
        });
        
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers
          }
        );
      }

      // Check for admin routes
      if (isAdminPath && session.role !== 'ADMIN') {
        const headers = new Headers({
          'Content-Type': 'application/json',
          ...(isAllowed ? { 'Access-Control-Allow-Origin': origin || '*' } : {})
        });
        
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden' }),
          { 
            status: 403,
            headers
          }
        );
      }
    }
    
    // Return the response with CORS headers for API routes
    const apiResponse = NextResponse.next();
    if (isAllowed) {
      apiResponse.headers.set('Access-Control-Allow-Origin', origin || '*');
      apiResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      apiResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      apiResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    return apiResponse;
  }

  // Handle page routes
  type SessionToken = { role?: string; [key: string]: any } | null;
  const session = await getToken({ req: request }) as SessionToken;
  
  // Redirect to login if trying to access protected page
  if (!isPublicPath && !session) {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    addCorsHeaders(redirectResponse);
    addSecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  // Redirect to home if trying to access guest-only page while logged in
  if (isGuestOnlyPath && session) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    addCorsHeaders(redirectResponse);
    addSecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  // Redirect to unauthorized if trying to access admin page without admin role
  if (isAdminPath && session && session.role !== 'ADMIN') {
    const redirectResponse = NextResponse.redirect(new URL('/unauthorized', request.url));
    addCorsHeaders(redirectResponse);
    addSecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  // Add CORS and security headers to the response
  const finalResponse = NextResponse.next();
  addCorsHeaders(finalResponse);
  addSecurityHeaders(finalResponse);

  return finalResponse;
}

// Add CORS headers to a response
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  return response;
}

// Get CORS headers
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  };
}

// Add security headers to a response
function addSecurityHeaders(response: NextResponse) {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

// Export the config with matcher that excludes bypass routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth pages
     * - specific API routes that should bypass middleware
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|auth/|' + 
      bypassApiRoutes.map(route => route.replace(/\//g, '\\/')).join('|') + 
    ').*)',
  ],
};
