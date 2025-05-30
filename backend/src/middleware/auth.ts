import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { BlacklistedToken } from '../models/BlacklistedToken';
import { AppError } from './errorHandler';
import { env } from '../config/env';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header or cookie
    let token: string | undefined = undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.cookies['auth-token'];
    }
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return next(new AppError('Token has been invalidated', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
};

// Role-based access control middleware
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Please log in to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

// Admin-only middleware
export const adminOnly = restrictTo('admin');

// User-only middleware
export const userOnly = restrictTo('user'); 