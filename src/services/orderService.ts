import client from '../database';
import { Order, ordersModel } from '../models/ordersModel';
import validateUUID from '../utiles/validateUUID';
import { customError } from '../middleware/errorHandler';

// Get all orders by user id
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const conn = await client.connect();
    validateUUID(userId);
    const sql = `SELECT * FROM Orders WHERE user_id=$1;`;
    const values = [userId];
    const result = await client.query(sql, values);

    conn.release();
    return result.rows;
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem with getting orders for user: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

// Get all orders by product id
export const getOrdersByProduct = async (productId: string): Promise<Order[]> => {
  try {
    const conn = await client.connect();
    validateUUID(productId);
    const sql = `SELECT * FROM Orders WHERE product_id=$1'`;
    const values = [productId];
    const result = await client.query(sql, values);

    conn.release();
    return result.rows;
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem with getting orders by product: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};
