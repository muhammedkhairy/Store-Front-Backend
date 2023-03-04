import axios from 'axios';
import client from '../../database';
import { Admin } from '../adminModel';
import { Product, productModel } from '../productsModel';
import * as dotenv from 'dotenv';
import { hashPassword } from '../../utils/hashPasswords';
import validateUUID from '../../utils/validateUUID';

dotenv.config();
const port = process.env.NODE_PORT || 3000;

// Generate valid token to use in tests
const generateToken = async () => {
  const admin: Admin = {
    email: 'testadmin@example.com',
    password: '123456',
  };

  const conn = await client.connect();
  const sql = `INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *`;
  const values = [admin.email, hashPassword(admin.password)];
  await conn.query(sql, values);

  try {
    const response = await axios.post(`http://localhost:${port}/api/admin/login`, {
      email: admin.email,
      password: admin.password,
    });

    const authToken = response.data.token;
    return authToken;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

describe('Product model tests: ', () => {
  beforeAll(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  afterEach(async () => {
    const conn = await client.connect();
    await conn.query('TRUNCATE admins');
    conn.release();
  });

  afterAll(async () => {
    const conn = await client.connect();
    await conn.query('DELETE FROM products');
    conn.release();
  });

  let productId1: string;
  let productId2: string;
  let productId3: string;

  const testProduct: Product = {
    name: 'PS5 console',
    price: 1000,
    category: 'Games',
  };

  const expectedProducts: Product[] = [
    {
      name: 'Surface pro 4',
      price: 1500,
      category: 'Computers',
    },
    {
      name: 'Plastic Cards',
      price: 5,
      category: 'Games',
    },
  ];

  // Create new product
  describe('create a new product in the database', () => {
    it('should create a new product', async () => {
      const conn = await client.connect();
      conn.release();
      const response = await axios.post(`http://localhost:${port}/api/products`, testProduct, {
        headers: {
          Authorization: `Bearer ${await generateToken()}`,
        },
      });

      expect(response.status).toBe(201);
      expect(response.data.newProduct.name).toBe(testProduct.name);
      expect(response.data.newProduct.category).toBe('Games');
      productId1 = response.data.newProduct.id; // store the ID of the first product
    });
  });

  // Get all products
  describe('Get all products from the database', () => {
    it('should return an array of products', async () => {
      const products = await productModel.getAllProducts();
      expect(products).toEqual(jasmine.any(Array));
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return all products in the database', async () => {
      const conn = await client.connect();
      const sql = `INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *`;
      let rowCount = 0;

      for (let i = 0; i < expectedProducts.length; i++) {
        const values = [expectedProducts[i].name, expectedProducts[i].price, expectedProducts[i].category];
        const response = await conn.query(sql, values);
        rowCount += response.rowCount;
        if (i === 0) {
          productId2 = response.rows[0].id; // store the ID of the second product
        } else if (i === 1) {
          productId3 = response.rows[0].id; // store the ID of the third product
        }
      }
      conn.release();
      const products = await productModel.getAllProducts();
      expect(rowCount).toBe(expectedProducts.length);
      expect(products.length).toBe(3);
    });
  });

  // Get specific product
  describe('Get specific product from the database', () => {
    it('should validate that id is a valid UUID value', async () => {
      const isValid = validateUUID(productId1);
      expect(isValid).toBeTruthy;
    });

    it('should return product data if id is valid', async () => {
      const conn = await client.connect();
      const sql = `SELECT id, name, price, category FROM products WHERE id = $1;`;
      const value = [productId1];
      const result = await conn.query(sql, value);
      conn.release();

      const response = await productModel.getProduct(productId1);

      expect(result.rowCount).toBe(1);
      expect(response.category).toContain('Games');
    });

    it('should return error if id is not valid', async () => {
      const invalidId = '12345';
      expect(() => validateUUID(invalidId)).toThrowError('Invalid UUID format for ID');
    });
  });

  //Update product tests
  describe('updateProduct', () => {
    it('should update a Product in the database', async () => {
      const updatedProduct = {
        name: 'Server',
        price: 2000,
        category: 'Electronics',
      };
      const newUpdatedProduct = await productModel.updateProduct(productId2, updatedProduct);

      expect(newUpdatedProduct.id).toBe(productId2);
      expect(newUpdatedProduct.name).toBe(updatedProduct.name);
      expect(newUpdatedProduct.category).toBe(updatedProduct.category);
    });
  });
});
