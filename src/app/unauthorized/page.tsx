'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'You do not have permission to access this page.';
  const showBackButton = searchParams.get('showBack') !== 'false';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a 
                href="mailto:support@example.com" 
                className="text-primary hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
