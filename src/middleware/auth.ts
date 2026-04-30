import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import User from '../models/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mtn-clarity-ai-hackathon-secret-2026') as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw ApiError.unauthorized('User no longer exists');
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.tokenExpired();
      }
      throw ApiError.unauthorized('Invalid token');
    }
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mtn-clarity-ai-hackathon-secret-2026') as any;
          const user = await User.findById(decoded.id).select('-password');
          if (user) {
            req.user = user;
          }
        } catch (error) {
          // Ignore token errors for optional auth
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
