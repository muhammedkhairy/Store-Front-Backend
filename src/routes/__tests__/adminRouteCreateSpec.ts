import request from 'supertest';
import app from '../../server';
import client from '../../database';
import { Admin } from '../../models/adminModel';
import { hashPassword } from '../../utils/hashPasswords';

const admin: Admin = {
  email: 'admintest@example.com',
  password: 'password123',
};

describe('POST api/admin', () => {
  it('should return status 201 and create a new admin user', async () => {
    const response = await request(app)
      .post('/api/admin')
      .send({
        email: admin.email,
        password: hashPassword(admin.password),
      });

    expect(response.status).toBe(201);
    expect(response.body.admin.email).toBe(admin.email);
  });

  it('should return status 400 when email is missing', async () => {
    console.log('from post route');
    const response = await request(app)
      .post('/api/admin')
      .send({
        password: hashPassword(admin.password),
      });

    expect(response.status).toBe(400);
  });

  it('should return status 400 when password is missing', async () => {
    const response = await request(app).post('/api/admin').send({
      email: admin.email,
    });

    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  const conn = await client.connect();
  await conn.query(`DELETE FROM admins WHERE email='${admin.email}'`);
  conn.release();
});
