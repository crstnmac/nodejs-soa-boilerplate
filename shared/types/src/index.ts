/**
 * Shared TypeScript types for SOA architecture
 */

// ============================================
// User Types
// ============================================

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

// ============================================
// Product Types
// ============================================

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  categoryId: number | null;
  image: string | null;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: string;
  stock: number;
  categoryId?: number;
  image?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  categoryId?: number;
  image?: string;
  status?: 'active' | 'inactive' | 'archived';
}

// ============================================
// Category Types
// ============================================

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

// ============================================
// Order Types
// ============================================

export interface Order {
  id: number;
  userId: number;
  total: string;
  status: OrderStatus;
  shippingAddress: string | null;
  paymentMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
}

export interface OrderProductDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  items: OrderProductDTO[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

// ============================================
// Auth Types
// ============================================

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
  token: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface SignUpDTO {
  email: string;
  password: string;
  name?: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface SignOutDTO {
  sessionToken?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductSearchParams extends PaginationParams {
  search?: string;
  categoryId?: number;
}

// ============================================
// Error Types
// ============================================

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', 400, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;
    super('NOT_FOUND', 404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', 403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', 409, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super('INTERNAL_ERROR', 500, message);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super('SERVICE_UNAVAILABLE', 502, `Service ${service} is temporarily unavailable`);
  }
}

// ============================================
// Health Check Types
// ============================================

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: string;
  checks?: Record<string, HealthCheck>;
  cache?: {
    connected: boolean;
  };
}

// ============================================
// Service Communication Types
// ============================================

export interface ServiceRequest {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  payload: unknown;
}

export interface ServiceResponse {
  id: string;
  success: boolean;
  data?: unknown;
  error?: string;
}
