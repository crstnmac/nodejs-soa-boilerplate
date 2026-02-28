// API Response Types
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

// User Types
export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Auth Types
export interface Session {
  id: string;
  userId: number;
  expiresAt: string;
  token: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  categoryId: number | null;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: number;
  userId: number;
  total: string;
  status: OrderStatus;
  shippingAddress: string | null;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
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
  product?: Product;
}

export interface CreateOrderDTO {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

// Search & Filter Types
export interface ProductSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}

export interface OrderSearchParams {
  page?: number;
  limit?: number;
}
// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  service: string;
  version: string;
  timestamp: string;
}
