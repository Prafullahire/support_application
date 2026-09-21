'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';
import { officeBoyNavItems } from '@/lib/office-boy-nav';
import { useAuthStore } from '@/lib/auth-store';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Daily Attendance': CalendarCheck,
  'Monthly Report': CalendarDays,
  'Daily Checklist': ClipboardList,
  Profile: User,
  'Attendance Approval': ShieldCheck,
};

export function OfficeBoySidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleAccountLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="hidden md:flex md:w-20 lg:w-64 md:shrink-0 md:flex-col md:border-r md:border-black/5 md:bg-white">
      <div className="flex h-20 items-center justify-center border-b border-black/5 lg:justify-start lg:px-6">
        <div className="grid h-9 w-9 place-items-center rounded-lg brand-gradient text-sm font-bold text-white">
          N
        </div>
        <span className="ml-3 hidden text-lg font-bold tracking-tight text-brand-black lg:inline">
          NeoSOFT
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {officeBoyNavItems.map((item) => {
          const Icon = icons[item.label];
          const active =
            item.href === '/office-boy/dashboard'
              ? pathname === '/office-boy/dashboard'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start justify-center ${
                active
                  ? 'bg-brand-red/10 text-brand-red'
                  : 'text-gray-500 hover:bg-surface-muted hover:text-brand-black'
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/5 p-3">
        <button
          type="button"
          onClick={handleAccountLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-surface-muted hover:text-brand-black lg:justify-start"
          title="Exit account"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
