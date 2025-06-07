import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';

export function useAuthGuard(requiredRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN' = 'USER') {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client-side after component mounts
    if (typeof window === 'undefined') return;

    // If auth is still loading, do nothing
    if (auth.status === 'loading') return;

    // If not authenticated, redirect to login
    if (auth.status !== 'authenticated' || !auth.user) {
      const loginUrl = new URL('/login', window.location.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      router.replace(loginUrl.toString());
      return;
    }

    // Check if user has the required role
    const roleHierarchy = {
      'USER': 1,
      'ADMIN': 2,
      'SUPER_ADMIN': 3
    };

    const userRoleLevel = roleHierarchy[auth.user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      // User doesn't have required role, redirect to unauthorized or dashboard
      router.replace('/unauthorized');
    }
  }, [auth.status, auth.user, pathname, requiredRole, router]);

  // Return loading state and user info
  return {
    isLoading: auth.status === 'loading',
    isAuthenticated: auth.status === 'authenticated',
    user: auth.user,
    hasRole: (role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
      if (!auth.user) return false;
      const roleHierarchy = {
        'USER': 1,
        'ADMIN': 2,
        'SUPER_ADMIN': 3
      };
      const userRoleLevel = roleHierarchy[auth.user.role as keyof typeof roleHierarchy] || 0;
      return userRoleLevel >= roleHierarchy[role];
    }
  };
}

// Helper hook for admin routes
export function useAdminGuard() {
  return useAuthGuard('ADMIN');
}

// Helper hook for super admin routes
export function useSuperAdminGuard() {
  return useAuthGuard('SUPER_ADMIN');
}
