import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { EmbedController } from '../controllers/embed.controller';

const router = Router();

// POST /api/embed/dashboard - Generate dashboard URL with body params
router.post('/dashboard', authenticateToken, EmbedController.generateDashboardUrl);

// GET /api/embed/dashboard/:dashboardId - Generate dashboard URL with query params
router.get('/dashboard/:dashboardId', authenticateToken, EmbedController.generateDashboardUrlByQuery);

export default router;