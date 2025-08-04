import { jwtDecode } from 'jwt-decode';
import { ApiError } from './error';

type JwtPayload = {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

const TOKEN_KEY = 'auth_token';

// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

export class AuthUtils {
  // Get token from localStorage
  static getToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  // Set token in localStorage
  static setToken(token: string): void {
    if (!isBrowser) return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Remove token from localStorage
  static removeToken(): void {
    if (!isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
  }

  // Decode JWT token
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Get user info from token
  static getUserFromToken(token: string | null): { userId: string; email: string; role: string } | null {
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  }

  // Validate token format
  static isValidToken(token: string): boolean {
    try {
      const parts = token.split('.');
      return parts.length === 3 && 
             parts[0].length > 0 && 
             parts[1].length > 0 && 
             parts[2].length > 0;
    } catch (error) {
      return false;
    }
  }

  // Get auth headers for API requests
  static getAuthHeaders(token?: string): Record<string, string> {
    const authToken = token || this.getToken();
    
    if (!authToken) {
      throw new ApiError(
        'No authentication token found',
        401,
        'UNAUTHORIZED'
      );
    }

    if (!this.isValidToken(authToken)) {
      throw new ApiError(
        'Invalid token format',
        401,
        'INVALID_TOKEN'
      );
    }

    if (this.isTokenExpired(authToken)) {
      throw new ApiError(
        'Token has expired',
        401,
        'TOKEN_EXPIRED'
      );
    }

    return {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (!isBrowser) return false;
    
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if user has required role
  static hasRole(requiredRole: string): boolean {
    if (!isBrowser) return false;
    
    const token = this.getToken();
    if (!token) return false;
    
    const user = this.getUserFromToken(token);
    return user?.role === requiredRole || user?.role === 'ADMIN';
  }

  // Get current user info
  static getCurrentUser() {
    if (!isBrowser) return null;
    
    const token = this.getToken();
    if (!token) return null;
    
    return this.getUserFromToken(token);
  }
}

// Initialize auth state on client side
if (isBrowser) {
  const token = AuthUtils.getToken();
  if (token && AuthUtils.isTokenExpired(token)) {
    AuthUtils.removeToken();
  }
}
