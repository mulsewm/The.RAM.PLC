import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Health check endpoint for monitoring and load balancers
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'error', error: 'Health check failed' },
      { status: 503 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure fresh responses
