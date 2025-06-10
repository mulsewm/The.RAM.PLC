import { NextResponse } from 'next/server';

// This is a simple test endpoint for Next.js 13+ App Router
// It will be available at /api/test

export const dynamic = 'force-dynamic'; // Opt out of static rendering

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'Test endpoint is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
