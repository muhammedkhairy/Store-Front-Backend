import { NextFunction, Request, Response } from 'express';
import { Admin, createAdmin } from '../models/adminModel';

const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin: Admin = { email, password };
    await createAdmin(admin);
    res.status(201).json({
      admin,
      message: 'Admin user created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default createAdminUser;
