import { Router } from 'express';
import { sendMessage } from '../controllers/chat.controller';
import { requireAuth } from '../middleware/auth';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/message', requireAuth, chatLimiter, sendMessage);

export default router;
