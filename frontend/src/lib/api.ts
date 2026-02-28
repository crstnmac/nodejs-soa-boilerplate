import axios, { AxiosError } from 'axios';
import type { ApiResponse, PaginatedResponse, Product, Category, Order, CreateOrderDTO, HealthCheck } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/auth
  timeout: 30000,
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// Auth Endpoints
export const authApi = {
  signUp: async (data: { email: string; password: string; name?: string }) => {
    const response = await api.post<ApiResponse<{ user: any; session: any }>>('/auth/sign-up', data);
    return response.data;
  },
  signIn: async (data: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ user: any; session: any }>>('/auth/sign-in', data);
    return response.data;
  },
  signOut: async () => {
    const response = await api.post<ApiResponse>('/auth/sign-out');
    return response.data;
  },
  getSession: async () => {
    const response = await api.get<ApiResponse<{ user: any; session: any } | null>>('/auth/session');
    return response.data;
  },
};

// User Endpoints
export const userApi = {
  getMe: async () => {
    const response = await api.get<ApiResponse>('/users/me');
    return response.data;
  },
  updateMe: async (data: { name?: string; email?: string }) => {
    const response = await api.patch<ApiResponse>('/users/me', data);
    return response.data;
  },
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await api.post<ApiResponse>('/users/me/password', data);
    return response.data;
  },
};

// Product Endpoints
export const productApi = {
  getProducts: async (params: { page?: number; limit?: number; search?: string; categoryId?: number }) => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },
  getProductById: async (id: number) => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/products/categories/all');
    return response.data;
  },
  createProduct: async (data: {
    name: string;
    description?: string;
    price: string;
    stock: number;
    categoryId?: number;
    image?: string;
  }) => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },
  updateProduct: async (id: number, data: any) => {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/products/${id}`);
    return response.data;
  },
  createCategory: async (data: { name: string; description?: string }) => {
    const response = await api.post<ApiResponse<Category>>('/products/categories', data);
    return response.data;
  },
};

// Order Endpoints
export const orderApi = {
  getOrders: async (params: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },
  getOrderById: async (id: number) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (data: CreateOrderDTO) => {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },
  updateOrderStatus: async (id: number, status: string) => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data;
  },
  cancelOrder: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/orders/${id}`);
    return response.data;
  },
};

// Health Check
export const healthApi = {
  getHealth: async () => {
    const response = await api.get<HealthCheck>('/health');
    return response.data;
  },
};

export default api;
