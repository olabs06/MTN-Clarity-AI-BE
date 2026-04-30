import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { calculateSavings as computeSavings } from '../services/recommendationEngine';
import { validateSavingsCalculation } from '../utils/validators';
import { ApiError } from '../utils/ApiError';

export const calculateSavings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    validateSavingsCalculation(req.body);
    const { currentPlanId, targetPlanId } = req.body;

    const savings = await computeSavings(currentPlanId, targetPlanId);
    if (!savings) {
      throw ApiError.notFound('One or both plans');
    }

    res.json(savings);
  } catch (error) {
    next(error);
  }
};
