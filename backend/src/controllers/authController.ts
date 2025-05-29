import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { BlacklistedToken } from '../models/BlacklistedToken';
import { AppError } from '../middleware/errorHandler';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    // Set JWT as HTTP-only cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('auth-token', { httpOnly: true, sameSite: 'lax', secure: false });
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged out',
    });
  } catch (error) {
    next(error);
  }
}; 