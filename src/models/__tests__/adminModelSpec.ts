import client from '../../database';
import { Admin, createAdmin } from '../adminModel';
import { customError } from '../../middleware/errorHandler';

const admin: Admin = {
  email: 'testadmin@example.com',
  password: '123456',
};

describe('Admin creation Model', () => {
  beforeAll(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  afterEach(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  it('should create a new admin in the database', async () => {
    const conn = await client.connect();
    await createAdmin(admin);
    const result = await conn.query('SELECT * FROM admins WHERE email = $1', [admin.email]);
    conn.release();

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].email).toBe(admin.email);
  });

  it('should throw an error if password is missing', async () => {
    try {
      await createAdmin({
        email: admin.email,
        password: '',
      });
      fail('createAdmin did not throw an error');
    } catch (error) {
      const customError = error as customError;
      expect(customError.statusCode).toBe(400);
      expect(customError.errorCode).toBe('BAD_REQUEST');
      expect(customError.message).toBe('Email and password are required.');
    }
  });
});
