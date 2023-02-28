import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../server';
import client from '../../database';
import { Admin } from '../../models/adminModel';
import adminAuthHelper from '../../models/adminAuthHelper';
import * as dotenv from 'dotenv';

dotenv.config();
const pepper = process.env.BCRYPT_PASSWORD;
const salt = Number(process.env.SALT_ROUNDS);

const admin: Admin = {
  email: 'admintest@example.com',
  password: 'password123',
};

describe('POST /api/admin/login', () => {
  beforeAll(async () => {
    // create test admin user
    const hash = await bcrypt.hash(admin.password + pepper, salt);
    await client.query(`INSERT INTO admins (email, password) VALUES ('${admin.email}', '${hash}')`);
  });

  it('returns 200 and an auth token if the email and password are valid', async () => {
    const adminUser = await adminAuthHelper.authAdminHelper(admin.email, admin.password);
    const token = adminAuthHelper.generateAdminToken(adminUser);

    const response = await request(app)
      .post('/api/admin/login')
      .send({ email: admin.email, password: admin.password })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.token).toEqual(token);
  });

  it('returns 401 if the email and password are not valid', async () => {
    const response = await request(app).post('/api/admin/login').send({ email: admin.email, password: 'password' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('INVALID_PASSWORD');
  });

  /* it('returns 401 if the email and password are not valid', async () => {
    const response = await request(app)
      .post('/api/admin/login')
      .send({ email: admin.email, password: 'wrongpassword' });
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Invalid email or password');

    //console.log(response.body);
  }); */

  /* it('returns 404 if the email is not found', async () => {
    const response = await request(app)
      .post('/api/admin/login')
      .send({ email: 'nonexistent@example.com', password: 'adminPassword' })
      .expect(404);

    expect(response.body.message).toEqual({ message: 'Admin with email nonexistent@example.com not found' });
  }); */

  afterAll(async () => {
    // delete test admin user
    const conn = await client.connect();
    await conn.query(`DELETE FROM admins WHERE email='${admin.email}'`);
    conn.release();
  });
});
