import { Router } from 'express';
import { calculateSavings } from '../controllers/savings.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/calculate', requireAuth, calculateSavings);

export default router;
