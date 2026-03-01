import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import {
  createLogger,
  errorHandler,
  notFoundHandler,
  requestIdMiddleware,
  corsMiddleware,
} from '@soa/shared-utils';
import { getDb } from '@soa/shared-drizzle';
import { AdminController } from './controllers/admin.controller';
import adminRoutes from './routes/admin.routes';
import type { CacheService } from '@soa/shared-utils';

const app = express();
const logger = createLogger('admin-service');
const PORT = process.env.PORT || 3004;

let server: any;

// ============================================
// Security Middleware
// ============================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

app.use(corsMiddleware());

// ============================================
// Rate Limiting
// ============================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ============================================
// Request Logging
// ============================================

app.use(morgan('combined', {
  skip: (req: any) => req.path === '/health',
}));

// ============================================
// Body Parsing
// ============================================

app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ============================================
// Request ID Middleware
// ============================================

app.use(requestIdMiddleware);

// ============================================
// Health Check
// ============================================

app.get('/health', (req: any, res: any) => {
  res.json({
    status: 'healthy',
    service: 'admin-service',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Connect to Redis (initialized in routes)
// ============================================

import { getCache } from '@soa/shared-utils';
const cache = getCache(logger);

// ============================================
// Admin Routes
// ============================================

app.use('/api/admin', adminRoutes);

// ============================================
// 404 Handler
// ============================================

app.use(notFoundHandler);

// ============================================
// Global Error Handler
// ============================================

app.use(errorHandler(logger));

// ============================================
// Graceful Shutdown
// ============================================

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    logger.info('Admin Service closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.warn('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

const start = async () => {
  try {
    await getDb().execute('SELECT 1');
    logger.info('Database connected successfully');

    const adminController = new AdminController(logger, cache);
    server = app.listen(PORT, () => {
      logger.info(`Admin Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

start();

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
