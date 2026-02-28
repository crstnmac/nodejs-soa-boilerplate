import { z } from 'zod';
import type { Logger } from './logger';
import { ValidationError } from '@soa/shared-types';

export const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));
    
    throw new ValidationError('Validation failed', errors);
  }
  
  return result.data;
};

export const validateQuery = <T>(
  schema: z.ZodSchema<T>
) => {
  return (req: any, res: any, next: any) => {
    try {
      req.query = validate(schema, req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = <T>(
  schema: z.ZodSchema<T>
) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = validate(schema, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = <T>(
  schema: z.ZodSchema<T>
) => {
  return (req: any, res: any, next: any) => {
    try {
      req.params = validate(schema, req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// ============================================
// Common Validation Schemas
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const searchSchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type IdParams = z.infer<typeof idSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
