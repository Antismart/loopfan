import { Router } from 'express';
import { Request, Response } from 'express';
import { Tip, Membership } from '../models/Transaction';
import { Content } from '../models/Content';
import { User } from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/analytics/creator/{address}:
 *   get:
 *     summary: Get creator analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Creator analytics retrieved successfully
 */
router.get('/creator/:address', async (req: Request, res: Response): Promise<void> => {
  try {
    const address = req.params.address;
    if (!address) {
      res.status(400).json({
        success: false,
        error: { message: 'Address parameter is required' }
      });
      return;
    }
    
    const creatorAddress = address.toLowerCase();
    
    // Get total tips received
    const tipStats = await Tip.aggregate([
      { $match: { creatorAddress } },
      {
        $group: {
          _id: null,
          totalTips: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          uniqueTippers: { $addToSet: '$tipperAddress' }
        }
      }
    ]);

    // Get membership stats
    const membershipStats = await Membership.aggregate([
      { $match: { creatorAddress, isActive: true } },
      {
        $group: {
          _id: '$tierId',
          count: { $sum: 1 },
          members: { $addToSet: '$memberAddress' }
        }
      }
    ]);

    // Get content stats
    const contentStats = await Content.aggregate([
      { $match: { creatorAddress, isActive: true } },
      {
        $group: {
          _id: '$contentType',
          count: { $sum: 1 },
          totalViews: { $sum: '$engagement.views' },
          totalTips: { $sum: '$engagement.tips.count' }
        }
      }
    ]);

    // Get monthly earnings
    const monthlyEarnings = await Tip.aggregate([
      { $match: { creatorAddress } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          earnings: { $sum: '$amount' },
          tipCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        tips: tipStats[0] || { totalTips: 0, totalAmount: 0, uniqueTippers: [] },
        memberships: membershipStats,
        content: contentStats,
        monthlyEarnings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get creator analytics' }
    });
  }
});

/**
 * @swagger
 * /api/analytics/fan/{address}:
 *   get:
 *     summary: Get fan analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fan analytics retrieved successfully
 */
router.get('/fan/:address', async (req: Request, res: Response): Promise<void> => {
  try {
    const address = req.params.address;
    if (!address) {
      res.status(400).json({
        success: false,
        error: { message: 'Address parameter is required' }
      });
      return;
    }
    
    const fanAddress = address.toLowerCase();
    
    // Get tipping stats
    const tipStats = await Tip.aggregate([
      { $match: { tipperAddress: fanAddress } },
      {
        $group: {
          _id: null,
          totalTips: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          uniqueCreators: { $addToSet: '$creatorAddress' }
        }
      }
    ]);

    // Get membership stats
    const membershipStats = await Membership.aggregate([
      { $match: { memberAddress: fanAddress, isActive: true } },
      {
        $group: {
          _id: '$creatorAddress',
          memberships: { $push: { tierId: '$tierId', expiresAt: '$expiresAt' } }
        }
      }
    ]);

    // Get top creators by tips
    const topCreators = await Tip.aggregate([
      { $match: { tipperAddress: fanAddress } },
      {
        $group: {
          _id: '$creatorAddress',
          totalTipped: { $sum: '$amount' },
          tipCount: { $sum: 1 }
        }
      },
      { $sort: { totalTipped: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        tips: tipStats[0] || { totalTips: 0, totalAmount: 0, uniqueCreators: [] },
        memberships: membershipStats,
        topCreators
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get fan analytics' }
    });
  }
});

/**
 * @swagger
 * /api/analytics/platform:
 *   get:
 *     summary: Get platform-wide analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Platform analytics retrieved successfully
 */
router.get('/platform', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    const totalCreators = await User.countDocuments({ isCreator: true });
    
    // Get total tips
    const totalTips = await Tip.countDocuments();
    const totalTipVolume = await Tip.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get total memberships
    const totalMemberships = await Membership.countDocuments({ isActive: true });
    
    // Get total content
    const totalContent = await Content.countDocuments({ isActive: true });

    // Get recent activity
    const recentActivity = await Tip.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('tipperAddress creatorAddress amount token message createdAt');

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          creators: totalCreators,
          fans: totalUsers - totalCreators
        },
        tips: {
          count: totalTips,
          volume: totalTipVolume[0]?.total || 0
        },
        memberships: totalMemberships,
        content: totalContent,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get platform analytics' }
    });
  }
});

export { router as analyticsRoutes };
