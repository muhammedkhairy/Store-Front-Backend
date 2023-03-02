import client from '../database';
import { hashPassword } from '../utils/hashPasswords';
import { customError } from '../middleware/errorHandler';

export interface Admin {
  id?: string;
  email: string;
  password: string;
}

export const createAdmin = async (admin: Admin): Promise<void> => {
  const conn = await client.connect();
  try {
    // Check if an admin in the admin tables
    const checkSql = `SELECT id FROM admins`;
    const checkResult = await conn.query(checkSql);
    if (checkResult.rowCount > 0) {
      const error: customError = new Error('An admin user is already exists');
      error.statusCode = 500;
      error.errorCode = 'SERVER_ERROR';
      throw error;
    }

    if (!admin.email || !admin.password) {
      const error: customError = new Error('Email and password are required.');
      error.statusCode = 400;
      error.errorCode = 'BAD_REQUEST';
      throw error;
    }

    const sql = `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *;`;
    const values = [admin.email, hashPassword(admin.password)];
    const result = await conn.query(sql, values);

    conn.release();

    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};
