import request from 'supertest';
import app from '../server';

describe('GET /', () => {
  it('responds with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('responds with "Hello World!"', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('<h1>Hello World!</h1>');
  });

  it('should return 404 error for unknown routes', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toBe('The requested page was not found ⚓');
  });
});

describe('GET /api', () => {
  it('responds with status 404', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(404);
  });

  it('responds with a "NOT_FOUND" error message', async () => {
    const response = await request(app).get('/api');
    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested page was not found ⚓',
      },
    });
  });
});
