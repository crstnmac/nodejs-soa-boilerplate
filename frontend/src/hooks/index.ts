import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, userApi, productApi, orderApi } from '../lib/api';
import type {
  SignInCredentials,
  SignUpCredentials,
  ProductSearchParams,
  OrderSearchParams,
  CreateOrderDTO,
} from '../types';

// Auth Hooks
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInCredentials) => authApi.signIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast.success('Signed in successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignUpCredentials) => authApi.signUp(data),
    onSuccess: () => {
      toast.success('Account created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success('Signed out successfully!');
    },
  });
}

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => authApi.getSession(),
    retry: false,
    refetchOnWindowFocus: true,
  });
}

// User Hooks
export function useMe() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await userApi.getMe();
      return response.data;
    },
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; email?: string }) => userApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      userApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Product Hooks
export function useProducts(params: ProductSearchParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.getCategories(),
  });
}

// Order Hooks
export function useOrders(params: OrderSearchParams = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDTO) => orderApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderApi.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Export all admin hooks
export * from './useAdmin';
