import type { Request, Response, NextFunction } from 'express';
import type { Logger } from '@soa/shared-utils';
import type { Session } from '../auth.config';
import { auth } from '../auth.config';
import { UnauthorizedError, ForbiddenError } from '@soa/shared-types';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      throw new UnauthorizedError('No active session found');
    }

    req.user = session.user;
    req.session = session;
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
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      throw new UnauthorizedError('No active session found');
    }

    if (session.user.role !== 'admin') {
      throw new ForbiddenError('Admin access required');
    }

    req.user = session.user;
    req.session = session;
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
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session) {
      req.user = session.user;
      req.session = session;
    }
    next();
  } catch (error) {
    // Continue without auth on error
    next();
  }
};
