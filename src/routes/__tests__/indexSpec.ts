import request from 'supertest';
import app from '../../server';

describe('API Tests', function () {
  let authToken: string;

  beforeEach(async function () {
    // Login as admin to get the token
    const res = await request(app).post('/api/admin/login').send({
      email: 'admin@example.com',
      password: 'adminpassword',
    });
    authToken = res.body.token;
  });

  describe('GET /api/admin', function () {
    it('should return a 200 status code', async function () {
      const res = await request(app).get('/api/admin').set('Authorization', authToken);
      expect(res.status).toEqual(200);
    });
  });
});
