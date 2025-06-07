import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth-options';

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  return session;
}

export async function requireRole(requiredRole: string, req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // @ts-ignore - We know user has a role property
  if (session.user.role !== requiredRole && session.user.role !== 'ADMIN') {
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden' }), 
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  return session;
}

export function withAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const authResult = await requireAuth(req);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    return handler(req, ...args);
  };
}

export function withRole(requiredRole: string, handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const roleResult = await requireRole(requiredRole, req);
    
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }
    
    return handler(req, ...args);
  };
}
