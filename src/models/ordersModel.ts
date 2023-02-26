import client from '../database';
import { customError } from '../middleware/errorHandler';
import validateUUID from '../services/validateUUID';

interface Order {
  id: string;
  userId: string;
  orderId: string;
  quantity: number;
  status: string;
}

const getAllOrders = async (): Promise<Order[]> => {
  try {
    const result = await client.query('SELECT * FROM Orders');
    return result.rows;
  } catch (error) {
    throw new Error(`Error in getting orders data`);
  }
};

const getOrder = async (id: string): Promise<Order> => {
  try {
    validateUUID(id);
    const result = await client.query('SELECT * FROM Orders WHERE id=$1', [id]);
    if (result.rows.length === 0) {
      const error: customError = new Error(`order not found`);
      error.statusCode = 404;
      error.errorCode = 'ORDER_NOT_FOUND';
      throw error;
    }
    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem with getting order: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

const createNewOrder = async (order: Order): Promise<Order> => {
  try {
    const result = await client.query(
      'INSERT INTO Orders (id, user_id, order_id, quantity, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [order.id, order.userId, order.orderId, order.quantity, order.status]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error adding order: ${order.id}`);
  }
};

const updateOrder = async (id: string, order: Order): Promise<Order> => {
  try {
    validateUUID(id);
    const result = await client.query(
      'UPDATE Orders SET user_id=$1, order_id=$2, quantity=$3, status=$4 WHERE id=$5 RETURNING *',
      [order.userId, order.orderId, order.quantity, order.status, id]
    );
    if (result.rows.length === 0) {
      const error: customError = new Error(`order not found`);
      error.statusCode = 404;
      error.errorCode = 'ORDER';
      throw error;
    }
    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Can't update product`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

const deleteOrder = async (id: string): Promise<void> => {
  try {
    validateUUID(id);
    const result = await client.query('DELETE FROM Orders WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      const error: customError = new Error(`order not found`);
      error.statusCode = 404;
      error.errorCode = 'ORDER_NOT_FOUND';
      throw error;
    }
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Error in deleting product with id: ${id}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

export default {
  getAllOrders,
  getOrder,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
