import { Outlet } from '@tanstack/react-router';
import { Layout } from '../ui/layout';

export function AuthLayout() {
  return (
    <Layout className="min-h-screen">
      <main className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md p-6">
          <Outlet />
        </div>
      </main>
    </Layout>
  );
}
