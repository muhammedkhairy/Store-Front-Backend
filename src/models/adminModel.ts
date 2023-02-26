import client from '../database';
import { hashPassword } from '../utiles/hashPasswords';

export interface Admin {
  id?: string;
  email: string;
  password: string;
}

export const createAdmin = async (admin: Admin): Promise<void> => {
  const conn = await client.connect();
  try {
    const checkSql = `SELECT COUNT(*) FROM admins`;
    const checkResult = await conn.query(checkSql);
    const rowCount = parseInt(checkResult.rows[0].count);

    if (rowCount > 0) {
      const selectSql = `SELECT COUNT(*) FROM admins WHERE email = $1`;
      const selectResult = await conn.query(selectSql, [admin.email]);
      const existingRowCount = parseInt(selectResult.rows[0].count);
      if (existingRowCount > 0) {
        throw new Error('An admin user already exists with this email address');
      }
    }

    const sql = `INSERT INTO admins (email, password) VALUES ($1, $2);`;
    const values = [admin.email, hashPassword(admin.password)];
    const result = await conn.query(sql, values);
    conn.release();
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error adding admin: ${admin.email}`);
  }
};
