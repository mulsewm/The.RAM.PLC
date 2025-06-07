import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // First try to get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (session?.user) {
      return NextResponse.json({
        authenticated: true,
        user: session.user,
      });
    }

    // If no session, check for auth token in cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Verify the JWT token
    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      if (!decoded || typeof decoded === 'string' || !decoded.id) {
        throw new Error('Invalid token');
      }

      // Get fresh user data from the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          active: true,
        },
      });

      if (!user || !user.active) {
        throw new Error('User not found or inactive');
      }

      // Create a new session response
      const response = NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      });

      // Set the auth cookie in the response
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      // Clear invalid token
      const response = NextResponse.json(
        { authenticated: false, error: 'Invalid or expired session' },
        { status: 200 }
      );
      
      // Clear the auth cookie
      response.cookies.set({
        name: 'auth_token',
        value: '',
        expires: new Date(0),
        path: '/',
      });
      
      return response;
    }
  } catch (error) {
    console.error('Session check error:', error);
    const response = NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
    
    // Clear the auth cookie on error
    response.cookies.set({
      name: 'auth_token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  } finally {
    await prisma.$disconnect();
  }
}