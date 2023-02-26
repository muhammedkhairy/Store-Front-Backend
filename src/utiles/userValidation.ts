import client from '../database';

// Check if user with given email exists in the database
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const conn = await client.connect();
  const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
  const values = [email];
  const result = await client.query(query, values);
  conn.release();
  return result.rows[0].count > 0;
};

// Check if user with given email exists in the database
export const checkUserExists = async (username: string): Promise<boolean> => {
  const conn = await client.connect();
  const query = 'SELECT COUNT(*) FROM users WHERE user_name = $1';
  const values = [username];
  const result = await client.query(query, values);
  conn.release();
  return result.rows[0].count > 0;
};
