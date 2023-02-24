import client from '../database';

export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string;
  shipping_address?: string;
}

export class userModel {
  // Create new user
  static async createNewUser(user: User): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = `INSERT INTO users (first_name, last_name, user_name, email, password, shipping_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, user_name, email, shipping_address;`;
      const values = [
        user.first_name,
        user.last_name,
        user.user_name,
        user.email,
        user.password,
        user.shipping_address,
      ];
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error adding user: ${user.user_name}`);
    }
  }

  // get all users from database
  static async getALlUsers(): Promise<User[]> {
    const conn = await client.connect();
    try {
      const sql = `SELECT id, first_name, last_name, user_name, email, shipping_address FROM users;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error in getting users data`);
    }
  }

  // get specific user by id
  static async getUser(id: string): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = `SELECT id, first_name, last_name, user_name, email, shipping_address  FROM users WHERE id = $1;`;
      const value = [id];
      const result = await conn.query(sql, value);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error in getting user data`);
    }
  }
  // update specific user by id
  // delete specific user by id
}
