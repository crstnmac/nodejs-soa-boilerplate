import { z } from 'zod';
import type { Logger } from './logger';
import { ValidationError } from '@soa/shared-types';

const VALIDATED_INPUTS_KEY = '__validatedInputs';

export const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.issues.map((e: any) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));
    
    throw new ValidationError('Validation failed', errors);
  }
  
  return result.data;
};

const setValidatedInput = (
  req: any,
  res: any,
  key: 'query' | 'body' | 'params',
  value: unknown
) => {
  req[VALIDATED_INPUTS_KEY] = req[VALIDATED_INPUTS_KEY] ?? {};
  req[VALIDATED_INPUTS_KEY][key] = value;

  if (res?.locals) {
    res.locals[VALIDATED_INPUTS_KEY] = res.locals[VALIDATED_INPUTS_KEY] ?? {};
    res.locals[VALIDATED_INPUTS_KEY][key] = value;
  }

  try {
    req[key] = value;
    return;
  } catch {
    // Fallback for read-only accessors (e.g. req.query on newer Express/router stacks)
  }

  try {
    Object.defineProperty(req, key, {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch {
    // If this also fails, callers can still access validated values through helpers below.
  }
};

const getValidatedInput = <T>(
  req: any,
  res: any,
  key: 'query' | 'body' | 'params',
  fallback: T
): T => {
  const reqValue = req?.[VALIDATED_INPUTS_KEY]?.[key];
  if (reqValue !== undefined) return reqValue as T;

  const resValue = res?.locals?.[VALIDATED_INPUTS_KEY]?.[key];
  if (resValue !== undefined) return resValue as T;

  return fallback;
};

export const getValidatedQuery = <T = any>(req: any, res: any): T =>
  getValidatedInput<T>(req, res, 'query', req.query);

export const getValidatedBody = <T = any>(req: any, res: any): T =>
  getValidatedInput<T>(req, res, 'body', req.body);

export const getValidatedParams = <T = any>(req: any, res: any): T =>
  getValidatedInput<T>(req, res, 'params', req.params);

export const validateQuery = <T>(
  schema: z.ZodSchema<T>
) => {
  return (req: any, res: any, next: any) => {
    try {
      const parsed = validate(schema, req.query);
      setValidatedInput(req, res, 'query', parsed);
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
      const parsed = validate(schema, req.body);
      setValidatedInput(req, res, 'body', parsed);
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
      const parsed = validate(schema, req.params);
      setValidatedInput(req, res, 'params', parsed);
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
  id: z.string(),
});

export const searchSchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  categoryId: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type IdParams = z.infer<typeof idSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
