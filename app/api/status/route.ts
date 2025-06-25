import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

/**
 * GET /api/status
 * Check authentication status and return user info if authenticated
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { 
          status: 'unauthenticated',
          authenticated: false,
          message: 'Not authenticated',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }

    // Return minimal user info
    const { name, email, role } = session.user;
    return NextResponse.json({
      status: 'authenticated',
      authenticated: true,
      user: { name, email, role },
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Status check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Ensure this route is always dynamic
export const dynamic = 'force-dynamic';
