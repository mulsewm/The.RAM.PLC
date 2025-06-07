'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Session } from 'next-auth';

interface User {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      });
      
      if (!response.ok) {
        throw new Error('Session check failed');
      }
      
      const data = await response.json();
      
      if (data.authenticated && data.user) {
        // Update user state
        setUser(data.user);
        setStatus('authenticated');
        
        // Store minimal user data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            image: data.user.image,
          }));
        }
        
        return data.user;
      } else {
        // Clear any existing session data
        setUser(null);
        setStatus('unauthenticated');
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        
        return null;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      
      // Clear state on error
      setUser(null);
      setStatus('unauthenticated');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      return null;
    }
  }, []);

  // Set up auth state management
  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;

    const setupAuth = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        await checkAuth();
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial auth check
    const timeoutId = setTimeout(() => {
      setupAuth().catch(console.error);
    }, 0);

    // Set up periodic session check (every 5 minutes)
    interval = setInterval(() => {
      if (isMounted) {
        checkAuth().catch(console.error);
      }
    }, 5 * 60 * 1000);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [checkAuth]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setStatus('loading');
      
      // Clear any existing session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies to be sent
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Verify the session after successful login
      const user = await checkAuth();
      
      if (!user) {
        throw new Error('Failed to establish session');
      }
      
      // Update user state
      setUser(user);
      setStatus('authenticated');
      
      // Store minimal user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      setStatus('unauthenticated');
      setUser(null);
      
      // Clear any partial session data on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      // Clear auth cookies on error
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setStatus('loading');
      
      // Call the logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Clear local state
      setUser(null);
      setStatus('unauthenticated');
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      // Clear all auth cookies
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Redirect to login page
      router.push('/login');
      router.refresh(); // Ensure the client-side state is updated
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if the server logout fails
      setUser(null);
      setStatus('unauthenticated');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      // Clear all auth cookies on error too
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      router.push('/login');
      router.refresh(); // Ensure the client-side state is updated
    }
  };

  const refreshSession = useCallback(async () => {
    return checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    status,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
