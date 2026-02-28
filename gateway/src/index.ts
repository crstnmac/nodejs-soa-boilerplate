import express, { Router } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import {
  createLogger,
  errorHandler,
  requestIdMiddleware,
  corsMiddleware,
} from '@soa/shared-utils';

// Import routes
import routes from './routes';

const app = express();
const logger = createLogger('api-gateway');
const PORT = process.env.PORT || 3000;

// ============================================
// Security Middleware
// ============================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(corsMiddleware());

// ============================================
// Gateway-level Rate Limiting
// ============================================

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
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

// ============================================
// Routes
// ============================================

app.use('/api', routes);

// ============================================
// Root Endpoint
// ============================================

app.get('/', (req, res) => {
  res.json({
    name: 'SOA API Gateway',
    version: '2.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      products: '/api/products/*',
      orders: '/api/orders/*',
      health: '/health',
    },
    docs: '/docs',
  });
});

app.get('/docs', (req, res) => {
  res.json({
    name: 'SOA API Gateway',
    version: '2.0.0',
    authentication: {
      signUp: 'POST /api/auth/sign-up',
      signIn: 'POST /api/auth/sign-in',
      signOut: 'POST /api/auth/sign-out',
      session: 'GET /api/auth/session',
    },
    users: {
      getProfile: 'GET /api/users/me',
      updateProfile: 'PATCH /api/users/me',
      deleteAccount: 'DELETE /api/users/me',
      changePassword: 'POST /api/users/me/password',
    },
    products: {
      list: 'GET /api/products',
      getById: 'GET /api/products/:id',
      create: 'POST /api/products (admin)',
      update: 'PATCH /api/products/:id (admin)',
      delete: 'DELETE /api/products/:id (admin)',
      categories: 'GET /api/products/categories',
      createCategory: 'POST /api/products/categories (admin)',
    },
    orders: {
      list: 'GET /api/orders (auth)',
      getById: 'GET /api/orders/:id (auth)',
      create: 'POST /api/orders (auth)',
      updateStatus: 'PUT /api/orders/:id/status (admin)',
      cancel: 'DELETE /api/orders/:id (auth)',
    },
  });
});

// ============================================
// Error Handler
// ============================================

app.use(errorHandler(logger));

// ============================================
// Start Server
// ============================================

const server = app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('Proxying to services:', {
    userService: process.env.USER_SERVICE_URL,
    productService: process.env.PRODUCT_SERVICE_URL,
    orderService: process.env.ORDER_SERVICE_URL,
  });
});

// ============================================
// Graceful Shutdown
// ============================================

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  server.close(() => {
    logger.info('Gateway closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.warn('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
