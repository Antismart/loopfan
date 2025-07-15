import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { statusCode = 500, message, stack } = error;
  
  logger.error('API Error:', {
    statusCode,
    message,
    stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  
  const response = {
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : message,
      ...(process.env.NODE_ENV === 'development' && { stack }),
    },
  };
  
  res.status(statusCode).json(response);
};
