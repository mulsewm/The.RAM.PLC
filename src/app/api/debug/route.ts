import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Debug endpoint hit');
    
    // Get the session
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session?.user) {
      console.log('No session found');
      return NextResponse.json(
        { authenticated: false, message: 'No active session' },
        { status: 200 }
      );
    }

    console.log('Session found:', session.user);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
