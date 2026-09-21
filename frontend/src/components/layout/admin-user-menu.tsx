'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { AdminProfileModal } from '@/components/layout/admin-profile-modal';
import { cn } from '@/lib/utils';

interface AdminUserMenuProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function AdminUserMenu({ className, size = 'md' }: AdminUserMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const avatarSize = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
    : 'U';
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push('/login');
  };

  const handleProfile = () => {
    setOpen(false);
    setProfileOpen(true);
  };

  return (
    <>
      <div className={cn('relative', className)} ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'overflow-hidden rounded-full ring-2 ring-white/80 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white',
            avatarSize,
          )}
          aria-label="Open account menu"
          aria-expanded={open}
        >
          {avatarError ? (
            <span className="grid h-full w-full place-items-center bg-brand-red text-xs font-bold text-white">
              {initials}
            </span>
          ) : (
            <Image
              src="/images/admin-user-avatar.png"
              alt={user ? `${user.firstName} ${user.lastName}` : 'Account'}
              width={size === 'sm' ? 36 : 40}
              height={size === 'sm' ? 36 : 40}
              className="h-full w-full object-cover"
              onError={() => setAvatarError(true)}
            />
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-xl ring-1 ring-black/5">
            <button
              type="button"
              onClick={handleProfile}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-brand-black hover:bg-surface-muted"
            >
              <User className="h-4 w-4 shrink-0 text-brand-red" />
              Profile
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-brand-black hover:bg-surface-muted"
            >
              <LogOut className="h-4 w-4 shrink-0 text-brand-red" />
              Logout
            </button>
          </div>
        )}
      </div>

      <AdminProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
