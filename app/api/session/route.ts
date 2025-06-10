import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { PrismaClient } from '@prisma/client';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

// This is required for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// This is the main handler for GET requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Not authenticated',
          timestamp: new Date().toISOString()
        }, 
        { 
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    // Get fresh user data from the database
    const prisma = new PrismaClient();
    
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          emailVerified: true,
          active: true,
          lastLogin: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { 
            authenticated: false, 
            error: 'User not found',
            timestamp: new Date().toISOString()
          }, 
          { 
            status: 404,
            headers: corsHeaders,
          }
        );
      }

      if (!user.active) {
        return NextResponse.json(
          { 
            authenticated: false, 
            error: 'Account is not active',
            timestamp: new Date().toISOString()
          }, 
          { 
            status: 403,
            headers: corsHeaders,
          }
        );
      }
      
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Return the session data with fresh user info
      return NextResponse.json(
        {
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin,
          },
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    } catch (dbError) {
      console.error('Database error in session route:', dbError);
      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Database error',
          timestamp: new Date().toISOString()
        },
        { 
          status: 500,
          headers: corsHeaders,
        }
      );
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error in session route:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// This is required for Next.js 13+ App Router
export const dynamic = 'force-dynamic';

// This is required for Next.js 13+ App Router
export const revalidate = 0;
