import { Outlet, Link } from '@tanstack/react-router';
import { Layout, LayoutHeader, LayoutTitle } from './ui/layout';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

export function MainLayout() {
  return (
    <Layout className="min-h-screen">
      <LayoutHeader>
        <LayoutTitle>SOA Dashboard</LayoutTitle>
        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Products
          </Link>
          <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
            Orders
          </Link>
          <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
            Profile
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
          </div>
        </nav>
      </LayoutHeader>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </Layout>
  );
}
