import { useState, useEffect } from 'react';
import { createRootRoute, Outlet, RouterProvider, createRoute, redirect, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Layout Components
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
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
  component: SignIn,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUp,
});

// Dashboard routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: MainLayout,
  children: [
    productsRoute,
    ordersRoute,
    profileRoute,
  ],
});

const productsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/products',
  component: Products,
});

const ordersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/orders',
  component: Orders,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/profile',
  component: Profile,
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
          toastOptions={{
            classNames: {
              toast: 'group toast group-[.toast]',
              description: 'text-sm opacity-90',
              actionButton: 'bg-primary text-primary-foreground',
              cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
            },
          }}
        />
        <Outlet />
      </RouterProvider>
    </QueryClientProvider>
  );
}
