'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Icons.layoutDashboard },
  { name: 'Applications', href: '/applications', icon: Icons.fileText },
  { name: 'Users', href: '/users', icon: Icons.users },
  { name: 'Settings', href: '/settings', icon: Icons.settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-background">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex-1 mt-5 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    'group flex items-center px-4 py-3 text-sm font-medium rounded-md',
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground group-hover:text-accent-foreground',
                      'mr-3 flex-shrink-0 h-5 w-5',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 p-4 border-t">
          <div className="flex items-center w-full">
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                View profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
