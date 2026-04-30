import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Plan from '../models/plan.model';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    
    // Enrich with plan details if they have a current plan
    let planData = null;
    if (user.currentPlanId) {
      planData = await Plan.findOne({ id: user.currentPlanId });
    }

    res.json({
      ...user.toObject(),
      planDetails: planData
    });
  } catch (error) {
    next(error);
  }
};