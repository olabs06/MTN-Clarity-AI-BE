import { Router } from 'express';
import { getAllPlans, getPlanById, comparePlans, switchPlan } from '../controllers/plan.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All plan routes require authentication
router.use(requireAuth);

router.get('/', getAllPlans);
router.post('/switch', switchPlan);
router.get('/:planId', getPlanById);
router.post('/compare', comparePlans);

export default router;
