import { Request, Response, NextFunction } from 'express';
import { createOrderProduct, getOrderProductById, updateOrderProduct, deleteOrderProduct } from '../services/orderProductService';

// Create an order product
const postOrderProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderProduct = await createOrderProduct(req.body);
    res.status(201).json(orderProduct);
  } catch (error) {
    next(error);
  }
};

// Get an order product by ID
const getOrderProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderProduct = await getOrderProductById(req.params.id);
    if (orderProduct) {
      res.status(200).json(orderProduct);
    } else {
      res.status(404).json({ message: 'Order product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// Update an order product by ID
const patchOrderProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderProduct = await updateOrderProduct(req.params.id, req.body.quantity);
    if (orderProduct) {
      res.status(200).json(orderProduct);
    } else {
      res.status(404).json({ message: 'Order product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// Delete an order product by ID
const deleteOrderProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderProduct = await deleteOrderProduct(req.params.id);
    if (orderProduct) {
      res.status(200).json({ message: 'Order product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order product not found' });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  postOrderProduct,
  getOrderProduct,
  patchOrderProduct,
  deleteOrderProductById
};
