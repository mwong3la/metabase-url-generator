import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login - Login and get JWT token
router.post('/login', AuthController.login);

// GET /api/auth/me - Get current user info (requires authentication)
router.get('/me', authenticateToken, AuthController.me);

export default router;