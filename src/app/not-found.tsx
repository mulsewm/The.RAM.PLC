import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
            
            <Button
              asChild
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Looking for something specific?{' '}
              <Link 
                href="/contact" 
                className="text-primary hover:underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// This ensures that this component is treated as a 404 page
export const dynamic = 'force-static';
