import { NextFunction, Request, Response } from 'express';
import { User, userModel } from '../models/userModel';
import { checkEmailExists, checkUserExists } from '../services/userValidation';

// Create new users
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, user_name, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

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

// Display all users in database
const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.getALlUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Display specific user by its id
const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await userModel.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update specific user details
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const updateUser = req.body;
    const user = await userModel.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updateItems: Partial<User> = {
      first_name: updateUser.first_name || user.first_name,
      last_name: updateUser.last_name || user.last_name,
      user_name: updateUser.user_name || user.user_name,
      email: updateUser.email || user.email,
      password: updateUser.password || user.password,
      shipping_address: updateUser.shipping_address || user.shipping_address,
    };

    const updateUserData = await userModel.updateUser(userId, updateItems);
    res.status(200).json({
      updateUserData,
      message: 'User successfully updated',
    });
  } catch (error) {
    next(error);
  }
};

// Delete specific user from the database with its id
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await userModel.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await userModel.deleteUser(userId);

    res.status(200).json({ message: `User with id: ${userId} successfully deleted` });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  index,
  show,
  update,
  deleteUser,
};
