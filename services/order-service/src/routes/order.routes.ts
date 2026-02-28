import type { Router, type Request, type Response } from 'express';
import { requireAuth, requireAdmin, asyncHandler, successResponse, createdResponse, validateBody, validateParams, idSchema, validateQuery, paginationSchema } from '@soa/shared-utils';
import { z } from 'zod';
import { OrderController } from '../controllers/order.controller';
import type { CreateOrderDTO, UpdateOrderStatusDTO, OrderStatus } from '@soa/shared-types';

const router = Router() as Router;

// ============================================
// Protected Routes
// ============================================

router.get(
  '/',
  requireAuth,
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await orderController.getUserOrders(req.user.id, req.query);
    return successResponse(result);
  })
);

router.get(
  '/:id',
  requireAuth,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderController.getOrderById(req.params.id);
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
      productId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive().min(1),
    })).min(1),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderController.createOrder(req.user.id, req.body as CreateOrderDTO);
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
    const order = await orderController.updateOrderStatus(req.params.id, req.body.status);
    return successResponse(order);
  })
);

router.delete(
  '/:id',
  requireAuth,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await orderController.cancelOrder(req.params.id, req.user.id);
    return successResponse({ success: true, message: 'Order cancelled successfully' });
  })
);

export default router;
