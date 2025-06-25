'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Icons.alert className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Something went wrong!
        </h1>
        <p className="mt-2 text-muted-foreground">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        <div className="mt-6 space-x-4">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="mr-2"
          >
            <Icons.refresh className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button asChild>
            <a href="/">
              <Icons.home className="mr-2 h-4 w-4" />
              Go home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
