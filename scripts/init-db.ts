import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database initialization...');

  // Create default admin user if not exists
  const adminEmail = 'admin@theramplc.com';
  const adminPassword = await hash('admin123', 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log('Creating default admin user...');
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        password: adminPassword,
        role: Role.ADMIN,
        active: true,
      },
    });
    console.log('Default admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  console.log('Database initialization completed');
}

main()
  .catch((e) => {
    console.error('Error initializing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
