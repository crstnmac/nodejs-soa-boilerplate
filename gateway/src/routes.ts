import { Router, type Request, type Response } from 'express';
import { createProxyMiddleware, type Options as ProxyOptions } from 'http-proxy-middleware';
import { createLogger } from '@soa/shared-utils';
import type { HealthCheck, ServiceUnavailableError } from '@soa/shared-types';

const logger = createLogger('gateway');

// Service URLs from environment
const SERVICES = {
  userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  productService: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
};

// Route mappings
const ROUTES: Record<string, { target: string; pathRewrite?: Record<string, string> }> = {
  '/api/auth': {
    target: SERVICES.userService,
    pathRewrite: { '^/api/auth': '/api/auth' },
  },
  '/api/users': {
    target: SERVICES.userService,
  },
  '/api/products': {
    target: SERVICES.productService,
  },
  '/api/orders': {
    target: SERVICES.orderService,
  },
};

const router = Router();

// ============================================
// Proxy Configuration
// ============================================

const proxyOptions: any = {
  changeOrigin: true,
  onProxyReq: (proxyReq: any, req: any) => {
    logger.debug('Proxying request', {
      method: req.method,
      path: req.path,
      target: proxyReq.opts.target,
      requestId: req.id,
    });
  },
  onError: (err: any, req: any, res: any) => {
    logger.error('Proxy error', {
      path: req.path,
      target: err.message,
      requestId: req.id,
    });

    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: {
          code: 'BAD_GATEWAY',
          message: `Service unavailable: ${err.message}`,
        },
        timestamp: new Date().toISOString(),
      });
    }
  },
};

// Apply route proxies
for (const [route, config] of Object.entries(ROUTES)) {
  const proxy = createProxyMiddleware({
    target: config.target,
    ...proxyOptions,
    pathRewrite: config.pathRewrite,
  });

  router.use(route, proxy as any);
}

// ============================================
// Health Check
// ============================================

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      userService: SERVICES.userService,
      productService: SERVICES.productService,
      orderService: SERVICES.orderService,
    },
  });
});

export default router;
