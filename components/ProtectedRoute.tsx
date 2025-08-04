'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole = 'USER',
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check if user has required role
      if (requiredRole === 'ADMIN' && !isAdmin) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isAdmin, loading, requiredRole, router, redirectTo]);

  // Show loading state while checking auth
  if (loading || !isAuthenticated || (requiredRole === 'ADMIN' && !isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
