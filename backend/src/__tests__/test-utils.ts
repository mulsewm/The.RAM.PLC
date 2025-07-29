import { PrismaClient } from '@prisma/client';
import { createServer } from '../index';
import { Server } from 'http';

export const testUser = {
  email: 'test@example.com',
  password: 'Test@123',
  name: 'Test User',
};

export async function setupTestServer() {
  const { app, server } = await createServer();
  const prisma = new PrismaClient();
  
  // Clean up database before tests
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
  
  return { app, server, prisma };
}

export async function teardownTestServer(server: Server, prisma: PrismaClient) {
  await prisma.$disconnect();
  server.close();
}
