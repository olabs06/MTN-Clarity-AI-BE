import { Router } from 'express';
import { getCurrentUsage, getUsageHistory } from '../controllers/usage.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/current', getCurrentUsage);
router.get('/history', getUsageHistory);

export default router;
