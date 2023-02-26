import { NextFunction, Request, Response } from 'express';
import { Product, productModel } from '../models/productsModel';

// Create new products
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price } = req.body;

    // Check if product and price are provided
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const newProduct: Product = await productModel.createNewProduct(req.body);
    res.status(201).json({
      newProduct,
      message: 'product is created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Display all products in database
const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await productModel.getALlproducts();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Display specific product by its id
const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const user = await productModel.getProduct(productId);
    if (!user) {
      throw new Error('Product not found');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update specific user details
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const updateProduct = req.body;
    const product = await productModel.getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const updateItems: Partial<Product> = {
      name: updateProduct.name || product.name,
      price: updateProduct.price || product.price,
      category: updateProduct.category || product.category,
    };

    const updateProductData = await productModel.updateProduct(productId, updateItems);
    res.status(200).json({
      updateProductData,
      message: 'Product details are successfully updated',
    });
  } catch (error) {
    next(error);
  }
};

// Delete specific user from the database with its id
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const product = await productModel.getProduct(productId);
    if (!product) {
      throw new Error('User not found');
    }

    await productModel.deleteProduct(productId);

    res.status(200).json({ message: `User with id: ${productId} successfully deleted` });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  index,
  show,
  update,
  deleteProduct,
};
