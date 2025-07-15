import { Router } from 'express';
import { userRoutes } from './users';
import { contentRoutes } from './content';
import { blockchainRoutes } from './blockchain';
import { analyticsRoutes } from './analytics';

const router = Router();

// API routes
router.use('/users', userRoutes);
router.use('/content', contentRoutes);
router.use('/blockchain', blockchainRoutes);
router.use('/analytics', analyticsRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'LoopFan API is running',
    timestamp: new Date().toISOString(),
  });
});

export { router as apiRoutes };
