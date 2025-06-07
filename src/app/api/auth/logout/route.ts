import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const response = NextResponse.json({ success: true });
    
    // Clear the auth token cookie
    cookieStore.set('auth_token', '', { 
      expires: new Date(0),
      path: '/',
    });
    
    // Clear NextAuth session cookies
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
    ];
    
    for (const cookieName of cookieNames) {
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
      });
    }
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
