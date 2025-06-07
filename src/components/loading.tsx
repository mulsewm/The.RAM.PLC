import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({
  fullScreen = false,
  className = '',
  text = 'Loading...',
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <span className="mt-2 text-sm text-gray-500">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// Page loading component for Next.js 13+ app directory
export function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

// Inline loading spinner
export function InlineLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

// Button loading state
export function ButtonLoading() {
  return (
    <div className="flex items-center">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Processing...</span>
    </div>
  );
}
