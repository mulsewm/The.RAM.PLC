import { ReactNode } from 'react';

export function PricingGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function PricingSection({
  title,
  description,
  children,
  className = ''
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
        <div className="mt-10">
          {children}
        </div>
      </div>
    </section>
  );
}

export function Callout({
  title,
  children,
  variant = 'info',
  icon: Icon,
  className = ''
}: {
  title: string;
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const variants = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-500',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-500',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-500',
    },
  }[variant];

  return (
    <div className={`rounded-lg p-4 ${variants.bg} ${variants.border} ${className}`}>
      <div className="flex">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${variants.icon}`} aria-hidden="true" />
          </div>
        )}
        <div className={`ml-3 ${Icon ? '' : 'ml-0'}`}>
          <h3 className={`text-sm font-medium ${variants.text}`}>{title}</h3>
          <div className={`mt-2 text-sm ${variants.text} opacity-90`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
