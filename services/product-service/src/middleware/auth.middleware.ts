import { Router, type Request, type Response } from 'express';

export const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No authorization header' },
    });
  }

  try {
    const response = await fetch(`${process.env.USER_SERVICE_URL}/api/auth/session`, {
      headers: { Cookie: req.headers.cookie as string },
    });
    const data = await response.json();

    if (!data.success || !data.data) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid session' },
      });
    }

    req.user = data.data.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication failed' },
    });
  }
};

export const requireAdmin = async (req: any, res: any, next: any) => {
  await requireAuth(req, res, (err) => {
    if (err) {
      return;
    }

    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' },
      });
    }

    next();
  });
};
