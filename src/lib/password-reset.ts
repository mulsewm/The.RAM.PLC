import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { hash } from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from './error-handler';

const prisma = new PrismaClient();

const randomBytesAsync = promisify(randomBytes);

interface PasswordResetToken {
  token: string;
  expires: Date;
}

interface UserWithResetFields {
  id: string;
  email: string;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
}

export async function generatePasswordResetToken(email: string): Promise<PasswordResetToken> {
  // 1. Generate a random token
  const token = (await randomBytesAsync(32)).toString('hex');
  
  // 2. Hash the token for storage
  const hashedToken = createHash('sha256').update(token).digest('hex');
  
  // 3. Set expiry to 1 hour from now
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);
  
  try {
    // 4. Save to database
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expires,
      },
    });
    
    // 5. Return the plain token (will be hashed when verifying)
    return {
      token,
      expires,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
      }
    }
    throw error;
  }
}

export async function verifyPasswordResetToken(
  email: string, 
  token: string
): Promise<boolean> {
  try {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    }) as UserWithResetFields | null;
    
    if (!user?.passwordResetToken || !user.passwordResetExpires) {
      return false;
    }
    
    // 2. Check if token has expired
    if (new Date() > user.passwordResetExpires) {
      return false;
    }
    
    // 3. Verify the token
    const hashedToken = createHash('sha256').update(token).digest('hex');
    return timingSafeEqual(
      Buffer.from(hashedToken, 'hex'),
      Buffer.from(user.passwordResetToken, 'hex')
    );
  } catch (error) {
    console.error('Error verifying password reset token:', error);
    return false;
  }
}

export async function clearPasswordResetToken(email: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
      }
    }
    throw error;
  }
}

export async function updatePassword(
  email: string,
  newPassword: string
): Promise<void> {
  const hashedPassword = await hash(newPassword, 10);
  
  try {
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
      }
    }
    throw error;
  }
}
