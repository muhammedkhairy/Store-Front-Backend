import request from 'supertest';
import app from '../../server';
import bcrypt from 'bcrypt';
import adminAuth from '../../models/adminAuthHelper';
import { Admin } from '../../models/adminModel';
import { hashPassword } from '../../utils/hashPasswords';

describe('Admin Routes', () => {
  describe('GET api/admin', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/api/admin');
      expect(response.status).toBe(200);
    });

    it('should return "Welcome to the admin page"', async () => {
      const response = await request(app).get('/api/admin');
      expect(response.text).toBe('Welcome to the admin page');
    });
  });

  describe('POST api/admin', () => {
    it('should return status 201 and create a new admin user', async () => {
      const email = 'admin@example.com';
      const password = 'password123';

      const response = await request(app).post('/api/admin').send({ email, password });

      expect(response.status).toBe(201);
      expect(response.body.admin.email).toBe(email);
    });

    it('should return status 400 when email is missing', async () => {
      const password = 'password123';

      const response = await request(app).post('/api/admin').send({ password });

      expect(response.status).toBe(400);
    });

    it('should return status 400 when password is missing', async () => {
      const email = 'admin@example.com';

      const response = await request(app).post('/api/admin').send({
        email: email,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST api/admin/login', () => {
    it('should return status 200 and a JWT token when email and password are correct', async () => {
      const email = 'admin@example.com';
      const password = 'password123';

      // Create an admin user for testing
      const pepperPassword = password + process.env.BCRYPT_PASSWORD;
      const hashedPassword = bcrypt.hashSync(pepperPassword, Number(process.env.SALT_ROUNDS));

      const response = await request(app).post('/api/admin/login').send({ email, hashedPassword });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return status 401 when email is incorrect', async () => {
      const email = 'wrong@example.com';
      const password = 'password123';

      const response = await request(app).post('/api/admin/login').send({ email, password });

      expect(response.status).toBe(401);
    });

    it('should return status 401 when password is incorrect', async () => {
      const email = 'admin@example.com';
      const password = 'wrongpassword';

      const response = await request(app).post('/api/admin/login').send({ email, password });

      expect(response.status).toBe(401);
    });

    it('should return status 400 when email is missing', async () => {
      const password = 'password123';

      const response = await request(app).post('/api/admin/login').send({ password });

      expect(response.status).toBe(400);
    });

    it('should return status 400 when password is missing', async () => {
      const email = 'admin@example.com';

      const response = await request(app).post('/api/admin/login').send({
        email: email,
      });

      expect(response.status).toBe(400);
    });
  });
});
