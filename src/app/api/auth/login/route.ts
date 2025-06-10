import { NextResponse, type NextRequest } from 'next/server';
import { compare } from 'bcryptjs';
import { PrismaClient, type User, type Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { type AuthOptions } from 'next-auth';

type AuditLogData = {
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  userId: string;
  request: NextRequest;
};

async function createAuditLog(data: AuditLogData) {
  const prisma = new PrismaClient();
  try {
    const ipAddress = data.request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = data.request.headers.get('user-agent') || 'unknown';
    
    await prisma.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details,
        userId: data.userId,
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// CORS headers for API responses
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL?.split(',')[0] || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

// Helper function to create a JSON response with CORS headers
const jsonResponse = (data: any, status: number = 200) => {
  return new NextResponse(JSON.stringify(data), { 
    status,
    headers: corsHeaders
  });
};

const prisma = new PrismaClient();

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

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  // Helper function to create JSON responses with CORS headers
  const jsonResponse = (data: any, status: number = 200) => {
    return NextResponse.json(data, { 
      status,
      headers: corsHeaders
    });
  };
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }
  
  // Only allow POST requests
  if (request.method !== 'POST') {
    return jsonResponse(
      { error: 'Method not allowed' },
      405
    );
  }
  
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };
    
    if (!email || !password) {
      return jsonResponse(
        { error: 'Email and password are required' },
        400
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // Check if user exists and is active
    if (!user) {
      await createAuditLog({
        action: 'auth.login_attempt',
        entityType: 'User',
        entityId: 'unknown',
        details: `Failed login attempt for email: ${email}`,
        userId: 'system',
        request,
      });
      
      return jsonResponse(
        { error: 'Invalid email or password' },
        401
      );
    }
    
    // At this point, user is guaranteed to be defined
    const validUser = user as User & { password: string; id: string; active: boolean };
    
    if (!validUser.active) {
      await createAuditLog({
        action: 'auth.login_attempt',
        entityType: 'User',
        entityId: validUser.id,
        details: 'Login attempt for deactivated account',
        userId: validUser.id,
        request,
      });
      
      return jsonResponse(
        { error: 'This account has been deactivated' },
        403
      );
    }
    
    // Verify password
    if (!validUser.password) {
      await createAuditLog({
        action: 'auth.login_error',
        entityType: 'User',
        entityId: validUser.id,
        details: 'Login error: User has no password set',
        userId: validUser.id,
        request,
      });
      
      return jsonResponse(
        { error: 'Authentication error' },
        500
      );
    }
    
    const isPasswordValid = await compare(password, validUser.password);
    
    if (!isPasswordValid) {
      await createAuditLog({
        action: 'auth.login_attempt',
        entityType: 'User',
        entityId: validUser.id,
        details: 'Failed login attempt: Invalid password',
        userId: validUser.id,
        request,
      });
      
      return jsonResponse(
        { error: 'Invalid email or password' },
        401
      );
    }
    
    // Update last login time
    await prisma.user.update({
      where: { id: validUser.id },
      data: { lastLogin: new Date() },
    });
    
    // Create audit log entry for successful login
    await createAuditLog({
      action: 'auth.login_success',
      entityType: 'User',
      entityId: validUser.id,
      details: 'User logged in successfully',
      userId: validUser.id,
      request,
    });
    
    // Create session using NextAuth
    const session = await getServerSession(authOptions as AuthOptions);
    
    if (!session) {
      await createAuditLog({
        action: 'auth.session_error',
        entityType: 'User',
        entityId: validUser.id,
        details: 'Failed to create session',
        userId: validUser.id,
        request,
      });
      
      return jsonResponse(
        { error: 'Failed to create session' },
        500
      );
    }
    
    // Create a success response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = validUser;
    
    // Create response with user data
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        user: userWithoutPassword,
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );

    // Set the auth token cookie
    if (session.user?.id) {
      response.cookies.set({
        name: 'auth_token',
        value: session.user.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      });
    }

    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Log the error to audit log if possible
    try {
      await prisma.auditLog.create({
        data: {
          action: 'auth.login_error',
          entityType: 'System',
          entityId: 'system',
          details: 'Error during login process',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          userId: 'system',
        },
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return jsonResponse(
      { 
        success: false,
        error: 'An error occurred during login',
        code: 'INTERNAL_SERVER_ERROR'
      },
      500
    );
  } finally {
    await prisma.$disconnect();
  }
}
