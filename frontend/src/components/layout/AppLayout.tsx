'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ProtectedRoute } from './ProtectedRoute';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <ProtectedRoute>
      {isLoginPage || pathname === '/' ? (
        <main>{children}</main>
      ) : (
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col relative w-full h-full">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
