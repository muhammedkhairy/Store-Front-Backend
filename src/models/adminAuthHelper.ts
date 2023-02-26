import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../database';
import { Admin } from '../models/adminModel';
import * as dotenv from 'dotenv';
import { customError } from '../middleware/errorHandler';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const secret = process.env.JWT_SECRET;

const authAdminHelper = async (email: string, password: string): Promise<Admin> => {
  const conn = await client.connect();
  try {
    const sql = `SELECT * FROM admins WHERE email = $1;`;
    const values = [email];
    const result = await conn.query(sql, values);

    if (result.rowCount === 0) {
      const error: customError = new Error(`Admin with email ${email} not found`);
      error.statusCode = 404;
      error.errorCode = 'ADMIN_NOT_FOUND';
      throw error;
    }

    const admin = result.rows[0];
    const passwordsMatch = bcrypt.compareSync(password + pepper, admin.password);

    if (!passwordsMatch) {
      const error: customError = new Error(`Invalid password for admin with email ${email}`);
      error.statusCode = 401;
      error.errorCode = 'INVALID_PASSWORD';
      throw error;
    }

    delete admin.password;
    return admin;
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

const generateAdminToken = (admin: Admin): string => {
  const payload = {
    userId: admin.id,
    email: admin.email,
  };
  const token = jwt.sign(payload, String(secret), { expiresIn: '2d' });
  return token;
};

export default {
  authAdminHelper,
  generateAdminToken,
};
