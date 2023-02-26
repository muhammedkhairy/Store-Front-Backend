import client from '../database';
import { customError } from '../middleware/errorHandler';
import { ordersModel } from '../models/ordersModel';
import { productModel } from '../models/productsModel';
import validateUUID from '../utiles/validateUUID';


interface OrderProduct {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
}


// Create productOrder
export const createOrderProduct = async (orderProduct: OrderProduct): Promise<OrderProduct> => {
  
  try {
    const conn = await client.connect();

    const { orderId, productId, quantity } = orderProduct;

    // Check if order and product exist
    await ordersModel.getOrder(orderId);
    await productModel.getProduct(productId);

    const sql = `INSERT INTO OrdersProducts (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;`;
    const values = [orderId, productId, quantity];
    const result = await client.query(sql, values);

    conn.release();
    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem creating order product: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

// Get productOrder by id
export const getOrderProductById = async (id: string): Promise<OrderProduct> => {
  try {
    const conn = await client.connect();

    validateUUID(id);
    const sql = `SELECT * FROM OrdersProducts WHERE id=$1;`;
    const values = [id];
    const result = await conn.query(sql, values);

    conn.release();
    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem getting order product: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

// Update productOrder by id
export const updateOrderProduct = async (id: string, quantity: number): Promise<OrderProduct> => {
  try {
    validateUUID(id);
    const conn = await client.connect();
    const sql = `
      UPDATE OrdersProducts
      SET quantity = $1
      WHERE id=$2
      RETURNING *
    `;
    const values = [quantity, id];
    const result = await conn.query(sql, values);

    conn.release();
    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem updating order product: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};

// Delete productOrder by id
export const deleteOrderProduct = async (id: string): Promise<OrderProduct> => {
  try {
    const conn = await client.connect();

    validateUUID(id);
    const sql = `DELETE FROM OrdersProducts WHERE id=$1 RETURNING *`;
    const values = [id];
    const result = await conn.query(sql, values);

    conn.release();
    return result.rows[0];
  } catch (error) {
    const customErr = error as customError;
    customErr.message = `Problem deleting order product: ${customErr.message}`;
    customErr.statusCode = customErr.statusCode || 500;
    customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
    throw customErr;
  }
};