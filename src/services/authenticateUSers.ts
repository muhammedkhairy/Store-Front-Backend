import { NextFunction, Request, Response } from 'express';
import autHelper from '../models/authHelper';

export const authUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await autHelper(email, password);
    res.status(200).json({
      user,
      message: "Successfully authorized"
    });
  } catch (error) {
    next(error);
  }
};