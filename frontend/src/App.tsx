import { createRootRoute, Outlet, RouterProvider, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Admin Pages
import { AdminLayout } from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

import { UserRole } from './types';

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
const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: Products,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: Orders,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

// Admin Routes with Layout
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
  beforeLoad: async () => {
    // Check if user is authenticated and has admin role
    // Note: This is a client-side check. For production, also validate on the backend
    try {
      const { authApi } = await import('./lib/api');
      const response = await authApi.getSession();
      const user = response?.data?.user;
      if (!user || user.role !== UserRole.ADMIN) {
        throw redirect({ to: '/sign-in', search: { redirect: window.location.pathname } });
      }
    } catch (error) {
      throw redirect({ to: '/sign-in', search: { redirect: window.location.pathname } });
    }
  },
});

// Admin Dashboard
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/dashboard',
  component: AdminDashboard,
});

// Admin Users
const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/users',
  component: AdminUsers,
});

// Admin Products
const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/products',
  component: AdminProducts,
});

// Admin Orders
const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/orders',
  component: AdminOrders,
});

// Admin root redirect to dashboard
const adminRootRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  beforeLoad: async () => {
    throw redirect({ to: '/admin/dashboard' });
  },
});

const routeTree = rootRoute.addChildren([
  signInRoute,
  signUpRoute,
  productsRoute,
  ordersRoute,
  profileRoute,
  adminLayoutRoute.addChildren([
    adminRootRoute,
    adminDashboardRoute,
    adminUsersRoute,
    adminProductsRoute,
    adminOrdersRoute,
  ]),
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
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
    </QueryClientProvider>
  );
}
