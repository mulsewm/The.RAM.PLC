'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unexpected error occurred.';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  const handleReset = () => {
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-md text-left mb-6 text-sm">
              <p className="font-medium">{error.name}: {error.message}</p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-1">Error ID: {error.digest}</p>
              )}
              {error.stack && (
                <pre className="mt-2 overflow-auto text-xs bg-gray-100 p-2 rounded">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If the problem persists, please{' '}
              <a 
                href="mailto:support@example.com" 
                className="text-primary hover:underline"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
