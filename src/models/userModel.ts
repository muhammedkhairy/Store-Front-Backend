import client from '../database';
import { hashPassword } from '../services/hashPasswords';
import { customError } from '../middleware/errorHandler';

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
        hashPassword(user.password),
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

      console.log(result.rows[0]);

      if (result.rows[0] === 0) {
        const error: customError = new Error(`User with id ${id} not found`);
        error.statusCode = 404;
        error.errorCode = 'USER_NOT_FOUND';
        throw error;
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error in getting user with id: ${id} data`);
    }
  }

  // update specific user by id
  static async updateUser(id: string, user: Partial<User>): Promise<User> {
    const conn = await client.connect();
    try {
      //Check user existence
      const existingUser = await this.getUser(id);
      if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
      }

      const sql = `UPDATE users SET first_name = $1, last_name = $2, user_name = $3, email = $4, password = $5, shipping_address = $6 WHERE id = $7 RETURNING id, first_name, last_name, user_name, email, shipping_address;`;
      const values = [
        user.first_name,
        user.last_name,
        user.user_name,
        user.email,
        user.password ? hashPassword(user.password) : undefined,
        user.shipping_address,
        id,
      ];
      const result = await conn.query(sql, values);
      conn.release();
      if (result.rowCount === 0) {
        throw new Error(`User with id ${id} not found`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error("Can't update user data");
    }
  }

  // delete specific user by id
  static async deleteUser(id: string): Promise<void> {
    const conn = await client.connect();
    try {
      const existingUser = await this.getUser(id);
      if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
      }

      const sql = `DELETE FROM users WHERE ID = $1`;
      const values = [id];
      const result = await conn.query(sql, values);
      conn.release();
    } catch (error) {
      throw new Error(`Error in deleting user with id: ${id}`);
    }
  }
}
function uuidv4(id: string) {
  throw new Error('Function not implemented.');
}

