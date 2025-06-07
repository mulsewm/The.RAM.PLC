import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email-service';
import { generatePasswordResetToken } from '@/lib/password-reset';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      // Don't reveal if the user exists or not
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link' },
        { status: 200 }
      );
    }

    // Generate password reset token
    const { token } = await generatePasswordResetToken(user.email);
    
    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
    
    // Send password reset email
    await emailService.sendPasswordResetEmail(
      user.email,
      user.name || 'User',
      resetUrl,
      1 // Link expires in 1 hour
    ).catch((error: Error | unknown) => {
      console.error('Failed to send password reset email:', error);
      // Don't fail the request if email sending fails
    });

    return NextResponse.json({
      message: 'If an account with that email exists, you will receive a password reset link',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
