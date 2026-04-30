import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { validateLoginInput, validateRegisterInput } from '../utils/validators';
import { AuthRequest } from '../middleware/auth';

const generateTokens = (userId: string) => {
  const expiresInStr = process.env.JWT_EXPIRES_IN || '1h';
  const refreshExpiresInStr = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'mtn-clarity-ai-hackathon-secret-2026',
    { expiresIn: expiresInStr as any }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'mtn-clarity-ai-hackathon-secret-2026',
    { expiresIn: refreshExpiresInStr as any }
  );

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateLoginInput(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ 
      $or: [{ email }, { phoneNumber: email }] 
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password and refresh token from response
    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).refreshToken;

    res.json({
      accessToken,
      refreshToken,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateRegisterInput(req.body);
    
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw ApiError.conflict('Email already in use');
    }

    // Assign 'pulse-flexi' as default plan for new users if not provided
    const userData = {
      ...req.body,
      currentPlanId: req.body.currentPlanId || 'pulse-flexi'
    };

    const user = await User.create(userData);
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).refreshToken;

    res.status(201).json({
      accessToken,
      refreshToken,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token required');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'mtn-clarity-ai-hackathon-secret-2026');
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokens = generateTokens(user.id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
