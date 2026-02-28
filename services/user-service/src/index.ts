import express from 'express';
import cors from 'cors';
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
import { auth } from './auth.config';
import userRoutes from './routes/user.routes';

const app = express();
const logger = createLogger('user-service');
const PORT = process.env.PORT || 3001;

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
  max: 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

app.use(limiter);

// ============================================
// Request Logging
// ============================================

app.use(morgan('combined', {
  skip: (req) => req.path === '/health',
}));

// ============================================
// Body Parsing
// ============================================

app.use(express.json({
  limit: '10mb',
  strict: false,
}));

app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ============================================
// Request ID Middleware
// ============================================

app.use(requestIdMiddleware());

// ============================================
// Health Check
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'user-service',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Better Auth Handler
// ============================================

app.all('/api/auth/*', async (req, res) => {
  auth.handler(req, res);
});

// ============================================
// User Routes
// ============================================

app.use('/api/users', userRoutes);

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
  
  // Stop accepting new connections
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.warn('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

const server = app.listen(PORT, () => {
  logger.info(`User Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
