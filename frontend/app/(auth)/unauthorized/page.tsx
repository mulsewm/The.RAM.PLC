import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Icons.alert className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          403 - Unauthorized
        </h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button>
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 