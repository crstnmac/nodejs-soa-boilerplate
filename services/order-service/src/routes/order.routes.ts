import type { Request, Response } from 'express';
import { Router } from 'express';
import { asyncHandler, successResponse, createdResponse, validateBody, validateParams, validateQuery, paginationSchema, getValidatedQuery } from '@soa/shared-utils';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { z } from 'zod';
import { OrderController } from '../controllers/order.controller';
import type { CreateOrderDTO, OrderStatus } from '@soa/shared-types';
import { idSchema } from '@soa/shared-utils';

const router = Router();

// Create a singleton instance of the controller
// Note: In a real application, you would use dependency injection
const orderController = new OrderController(
  console as any, // Logger
  {} as any // CacheService
);

// ============================================
// Protected Routes
// ============================================

router.get(
  '/',
  requireAuth,
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await orderController.getUserOrders(req.user!.id, getValidatedQuery(req, res));
    return successResponse(result);
  })
);

router.get(
  '/:id',
  requireAuth,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderController.getOrderById(req.params.id as string);
    return successResponse(order);
  })
);

router.get(
  '/status/:status',
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await orderController.getOrdersByStatus(req.params.status as OrderStatus, { page: 1, limit: 100 });
    return successResponse(result);
  })
);

router.post(
  '/',
  requireAuth,
  validateBody(z.object({
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.coerce.number().int().positive().min(1),
    })).min(1),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderController.createOrder(req.user!.id, req.body as CreateOrderDTO);
    return createdResponse(order);
  })
);

router.put(
  '/:id/status',
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderController.updateOrderStatus(req.params.id as string, req.body.status);
    return successResponse(order);
  })
);

router.delete(
  '/:id',
  requireAuth,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await orderController.cancelOrder(req.params.id as string, req.user!.id);
    return successResponse({ success: true, message: 'Order cancelled successfully' });
  })
);

export default router;
