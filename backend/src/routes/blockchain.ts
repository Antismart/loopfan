import { Router } from 'express';
import { Request, Response } from 'express';
import { blockchainService } from '../services/blockchain';
import { Tip, Membership } from '../models/Transaction';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/blockchain/tips:
 *   get:
 *     summary: Get tips history
 *     tags: [Blockchain]
 *     parameters:
 *       - in: query
 *         name: creator
 *         schema:
 *           type: string
 *         description: Filter by creator address
 *       - in: query
 *         name: tipper
 *         schema:
 *           type: string
 *         description: Filter by tipper address
 *     responses:
 *       200:
 *         description: Tips history retrieved successfully
 */
router.get('/tips', async (req: Request, res: Response) => {
  try {
    const { creator, tipper, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (creator) filter.creatorAddress = (creator as string).toLowerCase();
    if (tipper) filter.tipperAddress = (tipper as string).toLowerCase();

    const tips = await Tip.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Tip.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tips,
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
      error: { message: 'Failed to get tips' }
    });
  }
});

/**
 * @swagger
 * /api/blockchain/memberships:
 *   get:
 *     summary: Get memberships
 *     tags: [Blockchain]
 *     parameters:
 *       - in: query
 *         name: creator
 *         schema:
 *           type: string
 *         description: Filter by creator address
 *       - in: query
 *         name: member
 *         schema:
 *           type: string
 *         description: Filter by member address
 *     responses:
 *       200:
 *         description: Memberships retrieved successfully
 */
router.get('/memberships', async (req: Request, res: Response) => {
  try {
    const { creator, member, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { isActive: true };
    if (creator) filter.creatorAddress = (creator as string).toLowerCase();
    if (member) filter.memberAddress = (member as string).toLowerCase();

    const memberships = await Membership.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Membership.countDocuments(filter);

    res.json({
      success: true,
      data: {
        memberships,
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
      error: { message: 'Failed to get memberships' }
    });
  }
});

/**
 * @swagger
 * /api/blockchain/contract-info:
 *   get:
 *     summary: Get contract information
 *     tags: [Blockchain]
 *     responses:
 *       200:
 *         description: Contract info retrieved successfully
 */
router.get('/contract-info', async (req: Request, res: Response) => {
  try {
    const tipJarInfo = await blockchainService.getTipJarInfo();
    const blockNumber = await blockchainService.getBlockNumber();

    res.json({
      success: true,
      data: {
        tipJar: tipJarInfo,
        blockNumber,
        network: 'Base Sepolia',
        chainId: 84532
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get contract info' }
    });
  }
});

/**
 * @swagger
 * /api/blockchain/membership-tiers/{tierId}:
 *   get:
 *     summary: Get membership tier info
 *     tags: [Blockchain]
 *     parameters:
 *       - in: path
 *         name: tierId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membership tier info retrieved successfully
 */
router.get('/membership-tiers/:tierId', async (req: Request, res: Response): Promise<void> => {
  try {
    const tierId = req.params.tierId;
    if (!tierId) {
      res.status(400).json({
        success: false,
        error: { message: 'Tier ID is required' }
      });
      return;
    }

    const tierInfo = await blockchainService.getMembershipTierInfo(
      parseInt(tierId)
    );

    res.json({
      success: true,
      data: { tierInfo }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get tier info' }
    });
  }
});

/**
 * @swagger
 * /api/blockchain/points/{address}:
 *   get:
 *     summary: Get user points balance
 *     tags: [Blockchain]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Points balance retrieved successfully
 */
router.get('/points/:address', async (req: Request, res: Response): Promise<void> => {
  try {
    const address = req.params.address;
    if (!address) {
      res.status(400).json({
        success: false,
        error: { message: 'Address is required' }
      });
      return;
    }

    const pointsBalance = await blockchainService.getPointsBalance(address);

    res.json({
      success: true,
      data: { pointsBalance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get points balance' }
    });
  }
});

export { router as blockchainRoutes };
