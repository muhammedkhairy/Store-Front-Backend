import request from 'supertest';
import app from '../../../server';
import client from '../../../database';
import { Admin } from '../../../models/adminModel';

const admin: Admin = {
  email: 'admintest@example.com',
  password: 'password123',
};

// Delete all admin users if exists from the admins table before running the tests
beforeAll(async () => {
  const conn = await client.connect();
  await conn.query(`TRUNCATE admins;`);
  conn.release();
});

// Run tests on route /api/admin to register one admin user
describe('Admin registration: POST api/admin', () => {
  it('should return status 201 and create a new admin user', async () => {
    const response = await request(app).post('/api/admin').send(admin);

    expect(response.status).toBe(201);
    expect(response.body.admin.email).toBe(admin.email);
  });

  it('should return status 500 when admin is already register', async () => {
    const response = await request(app).post('/api/admin').send({
      email: 'adminexample@example.com',
      password: '654231',
    });

    expect(response.status).toBe(500);
    expect(response.body['error detail'].code).toBe('SERVER_ERROR');
  });
});

// Run tests on route /api/admin/login to authorize existing admin
describe('Admin authorization: POST api/admin/login', () => {
  it('should return status 200 and generate token for existing admin', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: admin.email,
      password: admin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.user.password).toBeUndefined();
    expect(response.body.token).toBeDefined();
    //console.log(response.body.token);
  });

  it('should return status 404 when admin email is wrong', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: 'adminexample@example.com',
      password: admin.password,
    });

    expect(response.status).toBe(404);
    expect(response.body['error detail'].code).toBe('ADMIN_NOT_FOUND');
  });

  it('should return status 401 when password is wrong', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: admin.email,
      password: '891234',
    });

    expect(response.status).toBe(401);
    expect(response.body['error detail'].code).toBe('INVALID_PASSWORD');
  });
});

// Delete all admin users if exists from the admins table after running the tests
afterAll(async () => {
  const conn = await client.connect();
  await conn.query(`TRUNCATE admins;`);
  conn.release();
});
