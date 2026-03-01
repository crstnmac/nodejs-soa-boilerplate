import type { Request, Response } from 'express';
import { Router } from 'express';
import { asyncHandler, successResponse, createdResponse, validateBody, validateParams, validateQuery, paginationSchema } from '@soa/shared-utils';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { z } from 'zod';
import { AdminController } from '../controllers/admin.controller';
import { idSchema } from '@soa/shared-utils';

const router = Router();

// Create a singleton instance of the controller
const adminController = new AdminController(
  console as any, // Logger
  {} as any // CacheService
);

// ============================================
// User Management Routes
// ============================================

router.get(
  '/users',
  requireAuth,
  requireAdmin,
  validateQuery(paginationSchema.extend({
    search: z.string().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await adminController.listUsers(req.query as any);
    return successResponse(result);
  })
);

router.get(
  '/users/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await adminController.getUserById(parseInt(req.params.id as string));
    return successResponse(user);
  })
);

router.put(
  '/users/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    role: z.enum(['user', 'admin']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await adminController.updateUser(parseInt(req.params.id as string), req.body);
    return successResponse(user);
  })
);

router.delete(
  '/users/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await adminController.deleteUser(parseInt(req.params.id as string));
    return successResponse(user);
  })
);

router.put(
  '/users/:id/role',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    role: z.enum(['user', 'admin']),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await adminController.changeUserRole(parseInt(req.params.id as string), req.body.role);
    return successResponse(user);
  })
);

// ============================================
// Product Management Routes
// ============================================

router.get(
  '/products',
  requireAuth,
  requireAdmin,
  validateQuery(paginationSchema.extend({
    search: z.string().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await adminController.listProducts(req.query as any);
    return successResponse(result);
  })
);

router.get(
  '/products/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await adminController.getProductById(parseInt(req.params.id as string));
    return successResponse(product);
  })
);

router.post(
  '/products',
  requireAuth,
  requireAdmin,
  validateBody(z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.string().regex(/^\d+\.\d{2}$/),
    stock: z.coerce.number().int().min(0),
    categoryId: z.coerce.number().int().positive().optional(),
    image: z.string().url().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await adminController.createProduct(req.body);
    return createdResponse(product);
  })
);

router.put(
  '/products/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    price: z.string().regex(/^\d+\.\d{2}$/).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    image: z.string().url().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await adminController.updateProduct(parseInt(req.params.id as string), req.body);
    return successResponse(product);
  })
);

router.delete(
  '/products/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await adminController.deleteProduct(parseInt(req.params.id as string));
    return successResponse(product);
  })
);

// ============================================
// Category Management Routes
// ============================================

router.get(
  '/categories',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await adminController.listCategories();
    return successResponse(result);
  })
);

router.post(
  '/categories',
  requireAuth,
  requireAdmin,
  validateBody(z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await adminController.createCategory(req.body);
    return createdResponse(category);
  })
);

router.put(
  '/categories/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await adminController.updateCategory(parseInt(req.params.id as string), req.body);
    return successResponse(category);
  })
);

router.delete(
  '/categories/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await adminController.deleteCategory(parseInt(req.params.id as string));
    return successResponse(category);
  })
);

// ============================================
// Order Management Routes
// ============================================

router.get(
  '/orders',
  requireAuth,
  requireAdmin,
  validateQuery(paginationSchema.extend({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await adminController.listOrders(req.query as any);
    return successResponse(result);
  })
);

router.get(
  '/orders/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await adminController.getOrderById(parseInt(req.params.id as string));
    return successResponse(order);
  })
);

router.put(
  '/orders/:id/status',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await adminController.updateOrderStatus(parseInt(req.params.id as string), req.body.status);
    return successResponse(order);
  })
);

router.delete(
  '/orders/:id',
  requireAuth,
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await adminController.cancelOrder(parseInt(req.params.id as string));
    return successResponse(result);
  })
);

// ============================================
// Dashboard Statistics Routes
// ============================================

router.get(
  '/stats/dashboard',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await adminController.getDashboardStats();
    return successResponse(stats);
  })
);

export default router;
