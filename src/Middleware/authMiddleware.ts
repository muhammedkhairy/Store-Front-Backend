import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { User } from '../models/userModel';
import { customError } from './errorHandler';

dotenv.config();

const secret = process.env.JWT_SECRET;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = String(req.headers.authorization?.split(' ')[1]);
    console.log(token);

    if (!token) {
      const error: customError = new Error('No Token provided');
      error.statusCode = 401;
      error.errorCode = 'UNAUTHORIZED';
      next(error);
    }

    const decodedToken = jwt.verify(token, String(secret));
    if (decodedToken) {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
