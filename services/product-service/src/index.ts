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
import { initProductRoutes } from './routes/product.routes';
import productRoutes from './routes/product.routes';

const app = express();
const logger = createLogger('product-service');
const PORT = process.env.PORT || 3002;
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
  max: 200,
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
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

app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ============================================
// Request ID Middleware
// ============================================

app.use(requestIdMiddleware);

// Connect to Redis (initialized in routes)
import { getCache } from '@soa/shared-utils';
const cache = getCache(logger);

// Initialize product routes with logger and cache
initProductRoutes(logger, cache);

// ============================================
// Health Check
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'product-service',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    cache: {
      connected: cache.isConnected(),
    },
  });
});

// ============================================
// Product Routes
// ============================================

app.use('/api/products', productRoutes);

// ============================================
// 404 Handler
// ============================================

app.use(notFoundHandler);

// ============================================
// Global Error Handler
// ============================================

app.use(errorHandler(logger));

// ============================================
// Start Server
// ============================================

const start = async () => {
  try {
    await getDb().execute('SELECT 1');
    logger.info('Database connected successfully');

    server = app.listen(PORT, () => {
      logger.info(`Product Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

start();

// ============================================
// Graceful Shutdown
// ============================================

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  server.close(() => {
    logger.info('Product Service closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.warn('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
