import axios from 'axios';
import type { ApiResponse, PaginatedResponse, User, Product, Category, Order } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await api.get<ApiResponse<{
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: string;
    recentOrders: Order[];
  }>>('/admin/dashboard');
  return response.data;
};

// Users
export const getUsers = async (params: { page?: number; limit?: number; search?: string; role?: string }) => {
  const response = await api.get<PaginatedResponse<User>>('/admin/users', { params });
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: { name?: string; email?: string }) => {
  const response = await api.patch<ApiResponse<User>>(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete<ApiResponse>(`/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id: number, role: string) => {
  const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/role`, { role });
  return response.data;
};

// Products
export const getProducts = async (params: { page?: number; limit?: number; search?: string; active?: boolean }) => {
  const response = await api.get<PaginatedResponse<Product>>('/admin/products', { params });
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get<ApiResponse<Product>>(`/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (data: {
  name: string;
  description?: string;
  price: string;
  stock: number;
  categoryId?: number;
  image?: string;
}) => {
  const response = await api.post<ApiResponse<Product>>('/admin/products', data);
  return response.data;
};

export const updateProduct = async (id: number, data: {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  categoryId?: number;
  image?: string;
  active?: boolean;
}) => {
  const response = await api.patch<ApiResponse<Product>>(`/admin/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete<ApiResponse>(`/admin/products/${id}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get<ApiResponse<Category[]>>('/admin/categories');
  return response.data;
};

export const createCategory = async (data: { name: string; description?: string }) => {
  const response = await api.post<ApiResponse<Category>>('/admin/categories', data);
  return response.data;
};

export const updateCategory = async (id: number, data: { name?: string; description?: string }) => {
  const response = await api.patch<ApiResponse<Category>>(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete<ApiResponse>(`/admin/categories/${id}`);
  return response.data;
};

// Orders
export const getOrders = async (params: { page?: number; limit?: number; status?: string }) => {
  const response = await api.get<PaginatedResponse<Order>>('/admin/orders', { params });
  return response.data;
};

export const getOrder = async (id: number) => {
  const response = await api.get<ApiResponse<Order & { items?: Array<{ id: number; productId: number; quantity: number; price: string; product?: Product }> }>>(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export const cancelOrder = async (id: number) => {
  const response = await api.delete<ApiResponse>(`/admin/orders/${id}`);
  return response.data;
};
