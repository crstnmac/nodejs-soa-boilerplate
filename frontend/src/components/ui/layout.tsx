import * as React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Layout({ className, children, ...props }: LayoutProps) {
  return (
    <div className={cn('flex min-h-screen w-full flex-col', className)} {...props}>
      {children}
    </div>
  );
}

function LayoutHeader({ className, children, ...props }: LayoutProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center gap-4 border-b bg-background px-6',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}

function LayoutTitle({ className, children, ...props }: LayoutProps) {
  return (
    <h1
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export { Layout, LayoutHeader, LayoutTitle };
