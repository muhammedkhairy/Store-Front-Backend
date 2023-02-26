import client from '../database';
import { customError } from '../middleware/errorHandler';
import validateUUID from '../utiles/validateUUID';

export interface Product {
  id?: string;
  name: string;
  price: number;
  category?: string;
}

export class productModel {
  // Create new product
  static async createNewProduct(product: Product): Promise<Product> {
    const conn = await client.connect();
    try {
      const sql = `INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *;`;
      const values = [
        product.name,
        product.price,
        product.category,
      ];
      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error adding product: ${product.name}`);
    }
  }

  // get all products from database
  static async getALlproducts(): Promise<Product[]> {
    const conn = await client.connect();
    try {
      const sql = `SELECT id, name, price, category FROM products;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error in getting products data`);
    }
  }

  // get specific product by id
  static async getProduct(id: string): Promise<Product> {
    const conn = await client.connect();
    try {
      //Check id is valid uuid
      validateUUID(id);

      const sql = `SELECT id, name, price, category  FROM products WHERE id = $1;`;
      const value = [id];
      const result = await conn.query(sql, value);
      conn.release();

      //Check product existence
      if (!result.rows[0]) {
        const error: customError = new Error(`product not found`);
        error.statusCode = 404;
        error.errorCode = 'product_NOT_FOUND';
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      const customErr = error as customError;
      customErr.message = `Problem with getting product: ${customErr.message}`;
      customErr.statusCode = customErr.statusCode || 500;
      customErr.errorCode = customErr.errorCode || 'SERVER_ERROR';
      throw customErr;
    }
  }

  // update specific product by id
  static async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const conn = await client.connect();
    try {
      //Check id is valid uuid
      validateUUID(id);

      //Check product existence
      const existingproduct = await this.getProduct(id);
      if (!existingproduct) {
        const error: customError = new Error(`product not found`);
        error.statusCode = 404;
        error.errorCode = 'product_NOT_FOUND';
        throw error;
      }

      const sql = `UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *;`;
      const values = [
        product.name,
        product.price,
        product.category,
        id,
      ];
      const result = await conn.query(sql, values);
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

  // delete specific product by id
  static async deleteProduct(id: string): Promise<void> {
    const conn = await client.connect();
    try {
      //Check id is valid uuid
      validateUUID(id);

      //Check product existence
      const existingproduct = await this.getProduct(id);
      if (!existingproduct) {
        const error: customError = new Error(`product not found`);
        error.statusCode = 404;
        error.errorCode = 'product_NOT_FOUND';
        throw error;
      }

      const sql = `DELETE FROM products WHERE ID = $1`;
      const values = [id];
      await conn.query(sql, values);
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
