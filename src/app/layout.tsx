import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-provider';
import { PartnershipProvider } from '@/lib/partnership-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The RAM PLC - Partner Management System',
  description: 'Manage your partnership applications and system settings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PartnershipProvider>
            {children}
          </PartnershipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
