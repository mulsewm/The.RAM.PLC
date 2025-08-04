import { AlertCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantStyles = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-400',
    icon: AlertCircle,
    iconColor: 'text-blue-500',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-400',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-400',
    icon: CheckCircle2,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-400',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
} as const;

type Variant = keyof typeof variantStyles;

interface CalloutProps {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Callout({
  variant = 'info',
  title,
  children,
  className,
  icon: Icon,
}: CalloutProps) {
  const { bg, border, icon: DefaultIcon, iconColor } = variantStyles[variant];
  const IconComponent = Icon || DefaultIcon;

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 p-4',
        bg,
        border,
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InfoCallout({
  title,
  children,
  className,
  icon,
}: Omit<CalloutProps, 'variant'>) {
  return (
    <Callout variant="info" title={title} className={className} icon={icon}>
      {children}
    </Callout>
  );
}

export function WarningCallout({
  title,
  children,
  className,
  icon,
}: Omit<CalloutProps, 'variant'>) {
  return (
    <Callout variant="warning" title={title} className={className} icon={icon}>
      {children}
    </Callout>
  );
}

export function SuccessCallout({
  title,
  children,
  className,
  icon,
}: Omit<CalloutProps, 'variant'>) {
  return (
    <Callout variant="success" title={title} className={className} icon={icon}>
      {children}
    </Callout>
  );
}

export function ErrorCallout({
  title,
  children,
  className,
  icon,
}: Omit<CalloutProps, 'variant'>) {
  return (
    <Callout variant="error" title={title} className={className} icon={icon}>
      {children}
    </Callout>
  );
}
