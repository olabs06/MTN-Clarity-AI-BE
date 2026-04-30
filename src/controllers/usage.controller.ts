import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MOCK_USAGE_CURRENT, MOCK_USAGE_HISTORY } from '../services/mockData';

export const getCurrentUsage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // In a real app, this would query the Usage model for the current user and month.
    // For the hackathon, we return the mock data.
    res.json(MOCK_USAGE_CURRENT);
  } catch (error) {
    next(error);
  }
};

export const getUsageHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const period = req.query.period as string;
    const limit = parseInt(req.query.limit as string) || 6;

    let history = [...MOCK_USAGE_HISTORY];
    
    // Filter by period if provided
    if (period && period === 'month') {
      // Return monthly history (which MOCK_USAGE_HISTORY already represents)
    }

    // Limit results
    history = history.slice(0, limit);

    res.json(history);
  } catch (error) {
    next(error);
  }
};
