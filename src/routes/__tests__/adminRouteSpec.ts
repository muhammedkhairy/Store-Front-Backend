import request from 'supertest';
import app from '../../server';
import adminAuth from '../../models/adminAuthHelper';
import { Admin } from '../../models/adminModel';
import { hashPassword } from '../../utils/hashPasswords';

describe('Admin Routes', () => {
  describe('GET /', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('api/admin');
      expect(response.status).toBe(200);
    });

    it('should return "Welcome to the admin page"', async () => {
      const response = await request(app).get('api/admin');
      expect(response.text).toBe('Welcome to the admin page');
    });
  });
});

describe('POST /admin', () => {
  it('should return status 201 and create a new admin user', async () => {
    const email = 'testadmin@example.com';
    const password = 'testpassword';
    const hashedPassword = hashPassword(password);

    const response = await request(app).post('api/admin').send({
      email: email,
      password: hashedPassword,
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(email);
  });

  it('should return status 400 when email is missing', async () => {
    const password = 'testpassword';
    const hashedPassword = hashPassword(password);

    const response = await request(app).post('api/admin').send({
      password: hashedPassword,
    });

    expect(response.status).toBe(400);
  });

  it('should return status 400 when password is missing', async () => {
    const email = 'testadmin@example.com';

    const response = await request(app).post('api/admin').send({
      email: email,
    });

    expect(response.status).toBe(400);
  });
});
