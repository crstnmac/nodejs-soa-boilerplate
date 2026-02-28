import { useState, useEffect } from 'react';
import { createRootRoute, Outlet, RouterProvider, createRoute, redirect, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Layout Components
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// Auth Check Component
import { useSession } from './hooks';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  loader: () => {
    const session = localStorage.getItem('session');
    return session ? redirect('/dashboard') : redirect('/sign-in');
  },
});

// Auth routes
const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  component: () => import('./pages/SignIn').then(m => m.default),
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: () => import('./pages/SignUp').then(m => m.default),
});

// Dashboard routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: MainLayout,
  loader: () => {
    return null;
  },
  children: [
    productsRoute,
    ordersRoute,
    profileRoute,
  ],
});

const productsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/products',
  component: () => import('./pages/Products').then(m => m.default),
});

const ordersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/orders',
  component: () => import('./pages/Orders').then(m => m.default),
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/profile',
  component: () => import('./pages/Profile').then(m => m.default),
});

const routeTree = rootRoute.addChildren([
  signInRoute,
  signUpRoute,
  dashboardRoute,
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routeTree}>
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
        />
        <Outlet />
      </RouterProvider>
    </QueryClientProvider>
  );
}
