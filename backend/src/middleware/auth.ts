import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    address: string;
    isCreator: boolean;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' }
      });
      return;
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as { address: string };
    const user = await User.findOne({ address: decoded.address.toLowerCase() });
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid token.' }
      });
      return;
    }
    
    req.user = {
      address: user.address,
      isCreator: user.isCreator,
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token.' }
    });
  }
};
