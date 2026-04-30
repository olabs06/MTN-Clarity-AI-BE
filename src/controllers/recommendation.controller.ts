import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getRecommendations as generateRecommendations } from '../services/recommendationEngine';

export const getRecommendations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recommendations = await generateRecommendations(req.user);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};
