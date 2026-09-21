'use client';

import { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { notificationsApi } from '@/lib/api';
interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationsApi
      .unreadCount()
      .then((res) => setUnreadCount(res.count))
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <header className="brand-gradient px-4 py-4 text-white lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-white/60">Welcome back</p>
            <p className="truncate text-sm font-bold">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-brand-red">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
}
