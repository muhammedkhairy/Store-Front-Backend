import { NextFunction, Request, Response } from 'express';
import { User, userModel } from '../models/userModel';
import { checkEmailExists, checkUserExists } from '../services/userValidation';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, user_name } = req.body;

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      res.status(409).json({
        error: 'Conflict,This email address is already exists',
        message: 'Please enter another email address',
      });
      return;
    }
    // Check if username already exists
    const userExists = await checkUserExists(user_name);
    if (userExists) {
      res.status(409).json({
        error: 'Conflict,This user name is already exists',
        message: 'Please enter another user name',
      });
      return;
    }
    const newUser: User = await userModel.createNewUser(req.body);
    res.status(201).json({
      newUser,
      message: 'user is created successfully',
    });
  } catch (error) {
    next(error);
  }
};

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.getALlUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await userModel.getUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  index,
  show,
};
