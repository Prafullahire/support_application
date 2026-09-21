'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LogOut, MoreVertical } from 'lucide-react';
import { officeBoyNavItems } from '@/lib/office-boy-nav';
import { useAuthStore } from '@/lib/auth-store';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleAccountLogout = async () => {
    setOpen(false);
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="relative md:hidden" ref={ref}>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-full text-white/90 hover:bg-white/10"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-52 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-xl ring-1 ring-black/5">
          {officeBoyNavItems
            .filter((item) => item.label !== 'Daily Attendance')
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-gray-700 hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={handleAccountLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-brand-black hover:bg-surface-muted"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
