import { ApiResponse, PaginatedResponse, AppError } from '@soa/shared-types';

export const successResponse = <T>(
  data: T,
  statusCode: number = 200
): { statusCode: number; body: ApiResponse<T> } => ({
  statusCode,
  body: {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  },
});

export const createdResponse = <T>(
  data: T,
  message: string = 'Resource created successfully'
): { statusCode: number; body: ApiResponse<T> } => ({
  statusCode: 201,
  body: {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  },
});

export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): { statusCode: number; body: PaginatedResponse<T> } => ({
  statusCode: 200,
  body: {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    timestamp: new Date().toISOString(),
  },
});

export const noContentResponse = (): { statusCode: number; body: Record<string, never> } => ({
  statusCode: 204,
  body: {},
});

export const errorResponse = (
  error: AppError | Error
): { statusCode: number; body: ApiResponse } => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Unknown error
  return {
    statusCode: 500,
    body: {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    },
  };
};
