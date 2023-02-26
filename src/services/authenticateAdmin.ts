import { NextFunction, Request, Response } from 'express';
import authAdminUser from '../models/adminAuthHelper';

export const authAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await authAdminUser.authAdminHelper(email, password);
    const token = authAdminUser.generateAdminToken(user);
    res.status(200).json({
      user,
      token,
      message: 'You are Successfully authorized',
    });
  } catch (error) {
    next(error);
  }
};
