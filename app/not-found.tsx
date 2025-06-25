import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Icons.search className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          404 - Page Not Found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">
              <Icons.home className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
