import type { Request, Response, NextFunction } from 'express';
import type { Logger } from './logger';
import { UnauthorizedError, ForbiddenError } from '@soa/shared-types';
import { errorResponse } from './response';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
    timestamp: new Date().toISOString(),
  });
};

export const errorHandler = (
  logger: Logger
) => (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
  });

  const response = errorResponse(err);
  res.status(response.statusCode).json(response.body);
};

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.id = req.headers['x-request-id'] as string || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
};

export const corsMiddleware = () => {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
  
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
    res.setHeader('Access-Control-Expose-Headers', 'X-Request-ID');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    
    next();
  };
};

// Extend Express Request type
declare module 'express' {
  interface Request {
    id?: string;
    user?: {
      id: number;
      email: string;
      role: string;
    };
    session?: {
      id: string;
      userId: number;
    };
  }
}
