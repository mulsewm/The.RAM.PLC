import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });
  
  console.log('User:', JSON.stringify(user, null, 2));
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log('User details:');
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Active: ${user.active}`);
  console.log(`Password set: ${!!user.password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
