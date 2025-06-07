import { NextResponse } from 'next/server';
import { verifyPasswordResetToken, updatePassword, clearPasswordResetToken } from '@/lib/password-reset';
import { z } from 'zod';

// Input validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = resetPasswordSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid request' },
        { status: 400 }
      );
    }
    
    const { token, email, password } = validation.data;
    
    // Verify the reset token
    const isValidToken = await verifyPasswordResetToken(email, token);
    
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }
    
    // Update the password
    await updatePassword(email, password);
    
    // Clear the reset token
    await clearPasswordResetToken(email);
    
    return NextResponse.json({
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    );
  }
}
