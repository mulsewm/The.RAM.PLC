'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={logout}>
          <Icons.logout className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
