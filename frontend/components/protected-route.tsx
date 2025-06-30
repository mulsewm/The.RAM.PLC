'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole = 'USER',
  loadingComponent,
  unauthorizedComponent,
}: ProtectedRouteProps) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!auth.user) return false;
    
    const roleHierarchy = {
      'USER': 1,
      'ADMIN': 2,
      'SUPER_ADMIN': 3
    };
    
    const userRoleLevel = roleHierarchy[auth.user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
    return userRoleLevel >= requiredRoleLevel;
  };

  useEffect(() => {
    // If not authenticated, redirect to login with callback URL
    if (auth.status === 'unauthenticated') {
      const loginUrl = new URL('/login', window.location.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      router.replace(loginUrl.toString());
    }
  }, [auth.status, pathname, router]);

  // Show loading state
  if (auth.status === 'loading') {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (auth.status !== 'authenticated' || !auth.user) {
    return null; // Will be redirected by the useEffect
  }

  // Check if user has the required role
  if (!hasRequiredRole()) {
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has the required role
  return <>{children}</>;
}

// Higher-order component for pages that require authentication
export function withAuth(
  Component: React.ComponentType,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function WithAuthComponent(props: any) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
