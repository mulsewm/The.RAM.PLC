import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { emailService } from '../src/lib/email';

const prisma = new PrismaClient();

async function testUserCreation() {
  try {
    console.log('Starting user creation test...');
    
    // Test data
    const testUser = {
      email: 'tesmulla@gmail.com',
      name: 'Test User',
      role: 'ADMIN' as const,
    };

    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });

    if (existingUser) {
      console.log('Test user already exists, deleting...');
      // First delete audit logs and other related records
      await prisma.auditLog.deleteMany({
        where: { userId: existingUser.id }
      });
      // Then delete the user
      await prisma.user.delete({ where: { email: testUser.email } });
      console.log('Old test user deleted successfully');
    }

    // Create test user
    console.log('Creating test user...');
    const password = 'test1234';
    const hashedPassword = await hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
        password: hashedPassword,
        active: true,
      },
    });

    console.log('Test user created successfully:', { id: user.id, email: user.email });

    // Test email sending
    console.log('Sending test welcome email...');
    const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
    await emailService.sendWelcomeEmail(user.email, user.name, loginUrl, password);
    console.log('Welcome email sent successfully!');
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testUserCreation()
  .catch((e) => {
    console.error('Unhandled error:', e);
    process.exit(1);
  });
