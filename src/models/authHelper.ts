import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../database';
import { User } from '../models/userModel';
import * as dotenv from 'dotenv';
import { customError } from '../middleware/errorHandler';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const secret = process.env.JWT_SECRET;

const autHelper = async (email: string, password: string): Promise<User> => {
  const conn = await client.connect();
  try {
    const sql = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];
    const result = await conn.query(sql, values);

    if (result.rowCount === 0) {
      const error: customError = new Error(`User with email ${email} not found`);
      error.statusCode = 404;
      error.errorCode = 'USER_NOT_FOUND';
      throw error;
    }

    const user = result.rows[0];
    const passwordsMatch = bcrypt.compareSync(password + pepper, user.password);

    if (!passwordsMatch) {
      const error: customError = new Error(`Invalid password for user with email ${email}`);
      error.statusCode = 401;
      error.errorCode = 'INVALID_PASSWORD';
      throw error;
    }

    delete user.password;
    return user;
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Something went wrong with login credentials: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, String(secret), { expiresIn: '2d' });
  return token;
};

export default {
  autHelper,
  generateToken,
};
