import client from '../database';
import { hashPassword } from '../utils/hashPasswords';

export interface Admin {
  id?: string;
  email: string;
  password: string;
}

export const createAdmin = async (admin: Admin): Promise<void> => {
  const conn = await client.connect();
  try {
    await conn.query('BEGIN');

    // Check if an admin with the same email address already exists
    const checkSql = `SELECT id FROM admins`;
    const checkResult = await conn.query(checkSql);
    if (checkResult.rowCount > 0) {
      throw new Error('An admin user already exists');
    }

    const sql = `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *;`;
    const values = [admin.email, hashPassword(admin.password)];
    const result = await conn.query(sql, values);

    await conn.query('COMMIT');
    conn.release();

    return result.rows[0];
  } catch (error) {
    await conn.query('ROLLBACK');
    conn.release();
    throw new Error(`Error adding admin: ${admin.email} - ${error}`);
  }
};

