import type { Request, Response, NextFunction } from 'express';
import type { Logger } from '@soa/shared-utils';
import type { Session } from '../auth';
import { auth } from '../auth';
import { UnauthorizedError, ForbiddenError } from '@soa/shared-types';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await auth.api.getSession({
      headers: req.headers,
    });

    if (!result) {
      throw new UnauthorizedError('No active session found');
    }

    req.user = result.user as unknown as { id: string; email: string; role: string };
    req.session = result.session as unknown as { id: string; userId: string };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await auth.api.getSession({
      headers: req.headers,
    });

    if (!result) {
      throw new UnauthorizedError('No active session found');
    }

    const userRole = (result.user as any).role;
    if (userRole !== 'admin') {
      throw new ForbiddenError('Admin access required');
    }

    req.user = result.user as unknown as { id: string; email: string; role: string };
    req.session = result.session as unknown as { id: string; userId: string };
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await auth.api.getSession({
      headers: req.headers,
    });

    if (result) {
      req.user = result.user as unknown as { id: string; email: string; role: string };
      req.session = result.session as unknown as { id: string; userId: string };
    }
    next();
  } catch (error) {
    // Continue without auth on error
    next();
  }
};
