import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { emailService } from '@/lib/email-service';

const prisma = new PrismaClient();

// Input validation schema
interface CreateUserInput {
  email: string;
  name: string;
  role: 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateUserInput = await request.json();

    // Validate required fields
    if (!body.email || !body.name || !body.role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a random password if not provided
    const password = body.password || Math.random().toString(36).slice(-10);
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        password: hashedPassword,
        active: true,
      },
    });

    // Send welcome email with login details
    try {
      const loginUrl = `${process.env.NEXTAUTH_URL}/login`;
      await emailService.sendWelcomeEmail(user.email, user.name, loginUrl, password);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email sending fails
    }

    // Don't return the password hash
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { data: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
