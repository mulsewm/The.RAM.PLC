import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS headers for API responses
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL?.split(',')[0] || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, x-requested-with',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
};

// Helper function to create a JSON response with CORS headers
const jsonResponse = (data: any, status: number = 200) => {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

// Ensure this route is not statically generated
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Content-Length': '0',
    },
  });
}

export async function POST(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  try {
    const cookieStore = cookies();
    const response = jsonResponse({ success: true });
    
    // Clear the auth token cookie
    const authTokenCookie = `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    
    // Clear NextAuth session cookies
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
    ];
    
    // Build the Set-Cookie header with all cookies to clear
    const cookiesToClear = [
      authTokenCookie,
      ...cookieNames.map(name => 
        `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
      )
    ];
    
    // Set the Set-Cookie header with all cookies to clear
    response.headers.set('Set-Cookie', cookiesToClear.join(', '));
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return jsonResponse(
      { 
        success: false, 
        error: 'Failed to log out',
        code: 'LOGOUT_FAILED' 
      },
      500
    );
  }
}
