import { Router } from 'express';
import { Request, Response } from 'express';
import { Content } from '../models/Content';
import { auth, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { blockchainService } from '../services/blockchain';

const router = Router();

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [video, audio, image, text, livestream]
 *               isGated:
 *                 type: boolean
 *               requiredTiers:
 *                 type: array
 *                 items:
 *                   type: number
 *               priceInUSDC:
 *                 type: number
 *     responses:
 *       201:
 *         description: Content created successfully
 */
router.post('/', auth, [
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').optional().isLength({ max: 2000 }),
  body('contentType').isIn(['video', 'audio', 'image', 'text', 'livestream']),
  body('isGated').isBoolean(),
  body('requiredTiers').optional().isArray(),
  body('priceInUSDC').optional().isNumeric()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }

    const contentHash = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const content = new Content({
      ...req.body,
      creatorAddress: req.user?.address,
      contentHash,
    });

    await content.save();

    // If content is gated, register it on the blockchain
    if (content.isGated && content.requiredTiers && content.priceInUSDC) {
      try {
        await blockchainService.registerContent(
          contentHash,
          content.requiredTiers,
          content.priceInUSDC.toString()
        );
      } catch (blockchainError) {
        // Log error but don't fail the content creation
        console.error('Failed to register content on blockchain:', blockchainError);
      }
    }

    res.status(201).json({
      success: true,
      data: { content }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create content' }
    });
  }
});

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get content list
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: creator
 *         schema:
 *           type: string
 *         description: Filter by creator address
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by content type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Content list retrieved successfully
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { creator, type, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { isActive: true };
    if (creator) filter.creatorAddress = (creator as string).toLowerCase();
    if (type) filter.contentType = type;

    const content = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Content.countDocuments(filter);

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get content' }
    });
  }
});

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      res.status(404).json({
        success: false,
        error: { message: 'Content not found' }
      });
      return;
    }

    // Increment view count
    await Content.findByIdAndUpdate(req.params.id, {
      $inc: { 'engagement.views': 1 }
    });

    res.json({
      success: true,
      data: { content }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get content' }
    });
  }
});

/**
 * @swagger
 * /api/content/{id}/access:
 *   get:
 *     summary: Check content access
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Access check completed
 */
router.get('/:id/access', auth, async (req: AuthRequest, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      res.status(404).json({
        success: false,
        error: { message: 'Content not found' }
      });
      return;
    }

    // If content is not gated, allow access
    if (!content.isGated) {
      res.json({
        success: true,
        data: { hasAccess: true, reason: 'Content is not gated' }
      });
      return;
    }

    // Check blockchain access
    const hasAccess = await blockchainService.checkContentAccess(
      req.user!.address,
      content.creatorAddress,
      content.contentHash
    );

    res.json({
      success: true,
      data: { hasAccess, reason: hasAccess ? 'Access granted' : 'Access denied' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check access' }
    });
  }
});

export { router as contentRoutes };
