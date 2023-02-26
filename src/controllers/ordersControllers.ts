import { NextFunction, Request, Response } from 'express';
import { Order, ordersModel } from '../models/ordersModel';
import * as ordersService from '../services/orderService';
import { customError } from '../middleware/errorHandler';
import validateUUID from '../services/validateUUID';

// Get all orders by user id
export const getOrdersByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params.userId;
    const orders: Order[] = await ordersService.getOrdersByUser(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get all orders by product id
export const getOrdersByProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId: string = req.params.productId;
    const orders: Order[] = await ordersService.getOrdersByProduct(productId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Add a new order
export const addOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
export const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: implement this function
  } catch (error) {
    next(error);
  }
};

// Delete an existing order
export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: implement this function
  } catch (error) {
    next(error);
  }
};
