import { Router } from 'express';
import { login, register, refresh, logout, me } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);
router.post('/refresh', refresh); // Rate limiting not as strict here
router.post('/logout', logout);
router.get('/me', optionalAuth, me);

export default router;
