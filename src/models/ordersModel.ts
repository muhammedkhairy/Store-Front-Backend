import client from '../database';
import { customError } from '../middleware/errorHandler';
import validateUUID from '../utils/validateUUID';

export interface Order {
  id?: string;
  userId: string;
  productId: string;
  quantity: number;
  status: string;
}

export class ordersModel {
  //Create a new order
  static async createNewOrder(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();

      const sql = `INSERT INTO Orders (id, user_id, order_id, quantity, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      const values = [order.id, order.userId, order.productId, order.quantity, order.status];
      const result = await client.query(sql, values);

      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error adding order: ${order.id}`);
    }
  }

  // Browse all orders
  static async getAllOrders(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const result = await client.query('SELECT * FROM Orders');

      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error in getting orders data`);
    }
  }

  // Browse a specific order
  static async getOrder(id: string): Promise<Order> {
    try {
      const conn = await client.connect();
      validateUUID(id);
      const result = await client.query('SELECT * FROM Orders WHERE id=$1', [id]);
      if (result.rows.length === 0) {
        const error: customError = new Error(`order not found`);
        error.statusCode = 404;
        error.errorCode = 'ORDER_NOT_FOUND';
        throw error;
      }

      conn.release();
      return result.rows[0];
    } catch (error) {
      const customErr = error as customError;
      customErr.message = `Problem with getting order: ${customErr.message}`;
      customErr.statusCode = customErr.statusCode || 500;
      customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
      throw customErr;
    }
  }

  //Update a specific order
  static async updateOrder(id: string, order: Order): Promise<Order> {
    try {
      const conn = await client.connect();

      validateUUID(id);
      const sql = `UPDATE Orders SET user_id=$1, order_id=$2, quantity=$3, status=$4 WHERE id=$5 RETURNING *;`;
      const values = [order.userId, order.productId, order.quantity, order.status, id];
      const result = await client.query(sql, values);

      if (result.rows.length === 0) {
        const error: customError = new Error(`order not found`);
        error.statusCode = 404;
        error.errorCode = 'ORDER';
        throw error;
      }

      conn.release();
      return result.rows[0];
    } catch (error) {
      const customErr = error as customError;
      customErr.message = `Can't update product`;
      customErr.statusCode = customErr.statusCode || 500;
      customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
      throw customErr;
    }
  }

  // Delete a specific order
  static async deleteOrder(id: string): Promise<void> {
    try {
      const conn = await client.connect();

      validateUUID(id);
      const sql = `DELETE FROM Orders WHERE id=$1;`;
      const values = [id];
      const result = await client.query(sql, values);

      if (result.rowCount === 0) {
        const error: customError = new Error(`order not found`);
        error.statusCode = 404;
        error.errorCode = 'ORDER_NOT_FOUND';
        throw error;
      }

      conn.release();
    } catch (error) {
      const customErr = error as customError;
      customErr.message = `Error in deleting product with id: ${id}`;
      customErr.statusCode = customErr.statusCode || 500;
      customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
      throw customErr;
    }
  }
}
