// @ts-nocheck
import { Router } from 'express';
import type { Request, Response } from 'express';
import { auth } from '../auth.config';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { asyncHandler, validateBody, validateParams, idSchema } from '@soa/shared-utils';
import { z } from 'zod';
import { UserController } from '../controllers/user.controller';
import { successResponse, createdResponse, noContentResponse } from '@soa/shared-utils';

const router = Router();
const logger = console as any;
const userController = new UserController(logger);

// ============================================
// Better Auth Endpoints (handled by better-auth)
// ============================================

router.post('/sign-up', asyncHandler(async (req: Request, res: Response) => {
  await auth.api.signUpEmail(req.body);
  return createdResponse({ success: true, message: 'User registered successfully' });
}));

router.post('/sign-in', asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.signInEmail(req.body);
  return successResponse({ session, user: session.user });
}));

router.post('/sign-out', asyncHandler(async (req: Request, res: Response) => {
  await auth.api.signOut(req.body);
  return noContentResponse();
}));

router.get('/session', asyncHandler(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return successResponse(session || null);
}));

// ============================================
// OAuth Endpoints (optional)
// ============================================

router.get('/oauth/google', asyncHandler(async (req: Request, res: Response) => {
  const url = await auth.api.getOAuthRedirectURL({
    providerId: 'google',
    redirectURL: `${process.env.AUTH_URL}/auth/callback/google`,
  });
  return successResponse({ url });
}));

router.get('/oauth/github', asyncHandler(async (req: Request, res: Response) => {
  const url = await auth.api.getOAuthRedirectURL({
    providerId: 'github',
    redirectURL: `${process.env.AUTH_URL}/auth/callback/github`,
  });
  return successResponse({ url });
}));

// ============================================
// User Management Routes
// ============================================

router.get('/me', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const user = await userController.getProfile(req.user.id);
  return successResponse(user);
}));

router.patch(
  '/me',
  requireAuth,
  validateBody(z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userController.updateProfile(req.user.id, req.body);
    return successResponse(user);
  })
);

router.delete('/me', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  await userController.deleteAccount(req.user.id);
  return noContentResponse();
}));

router.post(
  '/me/password',
  requireAuth,
  validateBody(z.object({
    oldPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    await userController.changePassword(req.user.id, req.body);
    return createdResponse({ success: true, message: 'Password changed successfully' });
  })
);

export default router;
