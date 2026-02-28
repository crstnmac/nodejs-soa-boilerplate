import { Outlet, Link } from '@tanstack/react-router';
import { Layout, LayoutHeader, LayoutTitle } from './ui/layout';

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
        </nav>
      </LayoutHeader>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </Layout>
  );
}
