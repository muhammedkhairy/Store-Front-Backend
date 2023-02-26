import { NextFunction, Request, Response } from 'express';
import auth from '../models/authHelper';

export const authUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await auth.autHelper(email, password);
    const token = auth.generateToken(user);
    res.status(200).json({
      user,
      token,
      message: 'You are Successfully authorized',
    });
  } catch (error) {
    next(error);
  }
};
