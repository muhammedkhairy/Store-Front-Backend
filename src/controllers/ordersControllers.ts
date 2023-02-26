import { NextFunction, Request, Response } from 'express';
import { Order, ordersModel } from '../models/ordersModel';
import * as ordersService from '../services/orderService';
import { customError } from '../middleware/errorHandler';

// Get all orders by user id
const getOrdersByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const orders: Order[] = await ordersService.getOrdersByUser(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get all orders by product id
const getOrdersByProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId: string = req.params.productId;
    const orders: Order[] = await ordersService.getOrdersByProduct(productId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Add a new order
const addOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, productId, quantity, status }: Order = req.body;

    // Validate userId and productId
    if (!userId || !productId) {
      const error: customError = new Error(`User ID and Product ID are required`);
      error.statusCode = 400;
      error.errorCode = 'BAD_REQUEST';
      throw error;
    }

    // Validate quantity
    if (quantity <= 0) {
      const error: customError = new Error(`Quantity must be greater than 0`);
      error.statusCode = 400;
      error.errorCode = 'BAD_REQUEST';
      throw error;
    }

    const newOrder: Order = {
      userId,
      productId,
      quantity,
      status,
    };

    const result = await ordersModel.createNewOrder(newOrder);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Update an existing order
const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const order: Order = req.body;
    const updatedOrder = await ordersModel.updateOrder (id, order);
    res.status(200).json({
      updatedOrder,
      message: 'Order updated successfully.'
    });
  } catch (error) {
    next(error);
  };
};


// Delete an existing order
const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    await ordersModel.deleteOrder(id);
    res.status(204).json({ message: `Order with id: ${id} successfully deleted` });
  } catch (error) {
    next(error);
  }
};


export default {
  getOrdersByUser,
  getOrdersByProduct,
  addOrder,
  updateOrder,
  deleteOrder,
};