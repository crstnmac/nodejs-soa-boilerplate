import type { Router, type Request, type Response } from 'express';
import { requireAdmin, asyncHandler, successResponse, createdResponse, validateParams, validateBody, validateQuery, paginationSchema, idSchema, searchSchema } from '@soa/shared-utils';
import { z } from 'zod';
import { ProductController } from '../controllers/product.controller';
import type { Logger } from '@soa/shared-utils';
import type { CacheService } from '@soa/shared-utils';
import type { CreateProductDTO, UpdateProductDTO, CreateCategoryDTO } from '@soa/shared-types';

const router = Router() as Router;
let productController: ProductController;

export const initProductRoutes = (logger: Logger, cache: CacheService) => {
  productController = new ProductController(logger, cache);
};

// ============================================
// Public Routes
// ============================================

router.get(
  '/',
  validateQuery(paginationSchema.extend(searchSchema)),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await productController.getAllProducts(req.query);
    return successResponse(result);
  })
);

router.get(
  '/categories/all',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await productController.getAllCategories();
    return successResponse(categories);
  })
);

// ============================================
// Protected Routes (Admin only)
// ============================================

router.get(
  '/:id',
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await productController.getProductById(req.params.id);
    return successResponse(product);
  })
);

router.post(
  '/',
  requireAdmin,
  validateBody(z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/),
    stock: z.coerce.number().int().min(0),
    categoryId: z.coerce.number().int().positive().optional(),
    image: z.string().url().optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await productController.createProduct(req.body as CreateProductDTO);
    return createdResponse(product);
  })
);

router.patch(
  '/:id',
  requireAdmin,
  validateParams(idSchema),
  validateBody(z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    image: z.string().url().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const product = await productController.updateProduct(req.params.id, req.body as UpdateProductDTO);
    return successResponse(product);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  validateParams(idSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await productController.deleteProduct(req.params.id);
    return successResponse({ success: true, message: 'Product deleted successfully' });
  })
);

router.post(
  '/categories',
  requireAdmin,
  validateBody(z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  })),
  asyncHandler(async (req: Request, res: Response) => {
    const category = await productController.createCategory(req.body as CreateCategoryDTO);
    return createdResponse(category);
  })
);

export default router;
