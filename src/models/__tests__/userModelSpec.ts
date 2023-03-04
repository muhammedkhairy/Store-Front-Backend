import axios from 'axios';
import client from '../../database';
import { Admin } from '../adminModel';
import { userModel, User } from '../userModel';
import * as dotenv from 'dotenv';
import { hashPassword } from '../../utils/hashPasswords';
import validateUUID from '../../utils/validateUUID';

dotenv.config();
const port = process.env.NODE_PORT || 3000;

// Generate valid token to use in tests
const generateToken = async () => {
  const admin: Admin = {
    email: 'testadmin@example.com',
    password: '123456',
  };

  const conn = await client.connect();
  const sql = `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *`;
  const values = [admin.email, hashPassword(admin.password)];
  await conn.query(sql, values);

  try {
    const response = await axios.post(`http://localhost:${port}/api/admin/login`, {
      email: admin.email,
      password: admin.password,
    });

    const authToken = response.data.token;
    return authToken;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

describe('User model tests: ', () => {
  beforeAll(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  afterEach(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query('DELETE FROM users');
    conn.release();
  });

  let userId1: string;
  let userId2: string;
  let userId3: string;

  const testUser: User = {
    first_name: 'John',
    last_name: 'Doe',
    user_name: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password',
    shipping_address: '123 Main St, Anytown USA',
  };

  const expectedUsers: User[] = [
    {
      first_name: 'Jane',
      last_name: 'Doe',
      user_name: 'janedoe11',
      email: 'johndoe12@example.com',
      password: '5552231',
      shipping_address: '123 Main St',
    },
    {
      first_name: 'John',
      last_name: 'Smith',
      user_name: 'johnsmith',
      email: 'janedoe@example.com',
      password: '5552231',
      shipping_address: '456 Elm St',
    },
  ];

  // Create new user
  describe('create a new user in the database', () => {
    it('should create a new user', async () => {
      const conn = await client.connect();
      await conn.query(`DELETE FROM users WHERE user_name = '${testUser.user_name}' AND email = '${testUser.email}';`);
      conn.release();
      const response = await axios.post(`http://localhost:${port}/api/users`, testUser, {
        headers: {
          Authorization: `Bearer ${await generateToken()}`,
        },
      });

      expect(response.status).toBe(201);
      expect(response.data.newUser.first_name).toBe(testUser.first_name);
      expect(response.data.newUser.last_name).toBe('Doe');
      expect(response.data.newUser.user_name).toBe('johndoe');
      expect(response.data.newUser.email).toBe('johndoe@example.com');
      expect(response.data.newUser.shipping_address).toBe('123 Main St, Anytown USA');
      userId1 = response.data.newUser.id; // store the ID of the first user
    });
  });

  // Get all users
  describe('Get all users from the database', () => {
    it('should return an array of users', async () => {
      const users = await userModel.getALlUsers();
      expect(users).toEqual(jasmine.any(Array));
      expect(users.length).toBeGreaterThan(0);
    });

    it('should return all users in the database', async () => {
      const conn = await client.connect();
      const sql = `INSERT INTO users (first_name, last_name, user_name, email, password, shipping_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      let rowCount = 0;

      for (let i = 0; i < expectedUsers.length; i++) {
        const values = [
          expectedUsers[i].first_name,
          expectedUsers[i].last_name,
          expectedUsers[i].user_name,
          expectedUsers[i].email,
          expectedUsers[i].password,
          expectedUsers[i].shipping_address,
        ];
        const response = await conn.query(sql, values);
        rowCount += response.rowCount;
        if (i === 0) {
          userId2 = response.rows[0].id; // store the ID of the second user
        } else if (i === 1) {
          userId3 = response.rows[0].id; // store the ID of the third user
        }
      }
      conn.release();
      const users = await userModel.getALlUsers();
      expect(rowCount).toBe(expectedUsers.length);
      expect(users.length).toBe(3);
    });
  });

  // Get specific user
  describe('Get specific user from the database', () => {
    it('should validate that id is a valid UUID value', async () => {
      const isValid = validateUUID(userId1);
      expect(isValid).toBeTruthy;
    });

    it('should return user data if id is valid', async () => {
      const conn = await client.connect();
      const sql = `SELECT id, first_name, last_name, user_name, email, shipping_address  FROM users WHERE id = $1;`;
      const value = [userId1];
      const result = await conn.query(sql, value);
      conn.release();

      const response = await userModel.getUser(userId1);

      expect(result.rowCount).toBe(1);
      expect(response.email).toContain('johndoe');
    });

    it('should return error if id is not valid', async () => {
      const invalidId = '12345';
      expect(() => validateUUID(invalidId)).toThrowError('Invalid UUID format for ID');
    });
  });

  //Update user tests
  describe('updateUser', () => {
    it('should update a user in the database', async () => {
      const updatedUser = {
        first_name: 'Sarah',
        last_name: 'Robert',
        user_name: 'Harris',
        email: 'robert@example.com',
        password: 'newpassword',
        shipping_address: '456 Second St',
      };
      const newUpdatedUser = await userModel.updateUser(userId2, updatedUser);

      expect(newUpdatedUser.id).toBe(userId2);
      expect(newUpdatedUser.first_name).toBe(updatedUser.first_name);
      expect(newUpdatedUser.last_name).toBe(updatedUser.last_name);
      expect(newUpdatedUser.user_name).toBe(updatedUser.user_name);
      expect(newUpdatedUser.email).toBe(updatedUser.email);
      expect(newUpdatedUser.shipping_address).toBe(updatedUser.shipping_address);
    });

    it('should not update password if it is not provided', async () => {
      const updatedUser = {
        first_name: 'Jane',
        last_name: 'Doe',
        user_name: 'janedoe',
        email: 'janedoe@example.com',
        shipping_address: '456 Second St',
      };
      const result = await userModel.updateUser(userId3, updatedUser);

      expect(result).not.toEqual(jasmine.objectContaining({ password: 'password' }));
    });
  });
});
