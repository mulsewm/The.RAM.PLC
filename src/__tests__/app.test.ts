import request from 'supertest';
import app from '../index';

describe('GET /api/health', () => {
  it('should return 200 and server status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('nodeVersion');
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Route not found');
  });
});
