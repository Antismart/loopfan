import { Router } from 'express';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { ethers } from 'ethers';

const router = Router();

// Get nonce for authentication
router.post('/auth/nonce', [
  body('address').isEthereumAddress().withMessage('Invalid Ethereum address')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }

    const { address } = req.body;
    const nonce = Math.floor(Math.random() * 1000000);
    const message = `Sign this message to authenticate with LoopFan: ${nonce}`;
    
    res.json({
      success: true,
      data: { message, nonce }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate nonce' }
    });
  }
});

// Verify signature and authenticate
router.post('/auth/verify', [
  body('address').isEthereumAddress(),
  body('signature').notEmpty(),
  body('message').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }

    const { address, signature, message } = req.body;
    
    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid signature' }
      });
      return;
    }

    // Find or create user
    let user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      user = new User({
        address: address.toLowerCase(),
        isCreator: false,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { address: user.address },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          address: user.address,
          username: user.username,
          isCreator: user.isCreator,
          profileImage: user.profileImage,
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Authentication failed' }
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ address: req.user?.address });
    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
      return;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get profile' }
    });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('username').optional().isLength({ min: 3, max: 30 }),
  body('bio').optional().isLength({ max: 500 }),
  body('email').optional().isEmail()
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

    const user = await User.findOneAndUpdate(
      { address: req.user?.address },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
      return;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: { message: 'Username or email already taken' }
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update profile' }
    });
  }
});

// Get public user profile
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ 
      address: req.params.address?.toLowerCase() 
    }).select('-fanProfile.membershipHistory');

    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
      return;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user' }
    });
  }
});

export { router as userRoutes };
