import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

// Define role constants to match the Prisma schema
const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Creating test user...');

    // Hash a simple password
    const hashedPassword = await hash('test123', 10);
    
    // Create test admin user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        password: hashedPassword
      },
      create: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: Role.ADMIN,
        active: true
      },
    });

    console.log('✅ Test user created:', testUser.email);
    console.log('✅ Password set to: test123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
