import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Visa Services - The.RAM.PLC',
  description: 'Comprehensive visa services for all your travel needs',
};

export default function VisaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      'min-h-[calc(100vh-64px)]', // Account for header height
      'bg-gradient-to-b from-background to-muted/20',
      inter.className
    )}>
      {children}
    </div>
  )
}
