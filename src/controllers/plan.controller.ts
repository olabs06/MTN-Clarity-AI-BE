import { Request, Response, NextFunction } from 'express';
import Plan from '../models/plan.model';
import { validatePlanComparison } from '../utils/validators';
import { planCatalogToFrontend } from '../utils/transformers';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth';

export const getAllPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plans = await Plan.find();
    res.json(plans.map(p => planCatalogToFrontend(p.toObject() as any)));
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await Plan.findOne({ id: req.params.planId });
    if (!plan) {
      throw ApiError.notFound('Plan');
    }
    res.json(planCatalogToFrontend(plan.toObject() as any));
  } catch (error) {
    next(error);
  }
};

export const comparePlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    validatePlanComparison(req.body);
    const { planIds } = req.body;

    const plans = await Plan.find({ id: { $in: planIds } });
    if (plans.length !== planIds.length) {
      throw ApiError.badRequest('One or more plan IDs are invalid');
    }

    // Mock comparison logic
    const comparison = {
      features: ['Data', 'Calls', 'SMS', 'Validity'],
      plans: plans.map(p => ({
        planId: p.id,
        values: [`${p.dataGB}GB`, `${p.callMinutes} mins`, `${p.smsCount}`, `${p.validityDays} days`]
      })),
      highlightedDifferences: [
        `${plans[0].name} has ${plans[0].dataGB}GB while ${plans[1]?.name} has ${plans[1]?.dataGB}GB`,
        'Difference in call minutes'
      ],
      recommendation: {
        recommendedPlanId: plans.reduce((prev, current) => (prev.dataGB > current.dataGB) ? prev : current).id,
        reason: 'Provides the most data value',
        savings: 0 // Simplification
      }
    };

    res.json({ comparison });
  } catch (error) {
    next(error);
  }
};

export const switchPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { planId } = req.body;
    if (!planId) {
      throw ApiError.badRequest('Plan ID is required');
    }

    const plan = await Plan.findOne({ id: planId });
    if (!plan) {
      throw ApiError.notFound('Plan');
    }

    const user = req.user;
    if (!user) {
      throw ApiError.unauthorized();
    }

    user.currentPlanId = planId;
    await user.save();

    res.json({
      success: true,
      message: `Successfully switched to ${plan.name}`,
      user: {
        ...user.toObject(),
        planDetails: plan
      }
    });
  } catch (error) {
    next(error);
  }
};
