import request from 'supertest';
import { Server } from 'http';
import { createServer } from '../index';
import { PrismaClient } from '@prisma/client';

let server: Server;
let app: any;
let prisma: PrismaClient;

beforeAll(async () => {
  const setup = await setupTestServer();
  app = setup.app;
  server = setup.server;
  prisma = setup.prisma;
});

afterAll(async () => {
  await teardownTestServer(server, prisma);
});

describe('API Health Check', () => {
  it('should return 200 and server status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      environment: expect.any(String),
      nodeVersion: expect.any(String),
      timestamp: expect.any(String)
    });
  });

  it('should include required security headers', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-download-options']).toBe('noopen');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
  });
});

describe('Error Handling', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: 'Route not found',
      error: {
        name: 'NotFoundError',
        message: 'The requested resource was not found',
        statusCode: 404
      }
    });
  });

  it('should handle 500 errors gracefully', async () => {
    // Mock a route that throws an error
    app.get('/api/error', () => {
      throw new Error('Test error');
    });
    
    const response = await request(app).get('/api/error');
    
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Internal Server Error',
      error: {
        name: 'Error',
        message: 'Test error',
        statusCode: 500
      }
    });
  });
});
