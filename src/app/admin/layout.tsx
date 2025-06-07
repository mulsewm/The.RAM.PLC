'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/auth-provider';
import { PartnershipProvider } from '@/lib/partnership-provider';
import { Role } from '@prisma/client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user, status, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (status === 'unauthenticated' || !user) {
          const callbackUrl = encodeURIComponent(pathname || '/admin');
          router.push(`/login?callbackUrl=${callbackUrl}`);
          return;
        }

        // Check user role
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
        
        if (!isAdmin) {
          router.push('/unauthorized');
          return;
        }

        // If we get here, user is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [user, status, router, pathname]);

  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Users
                </Link>
                <Link href="/admin/settings" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-4">
                    {user?.email}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => signOut()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <PartnershipProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </PartnershipProvider>
    </AuthProvider>
  );
}
