'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Package,
  Gift,
  Receipt,
  CreditCard,
  Wrench,
  Armchair,
  BookOpen,
  Home,
  Bell,
  Building2,
  Users,
  Building,
  Store,
  BarChart3,
  Upload,
  ScrollText,
  MapPin,
  UserCog,
  ClipboardCheck,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { isPrivilegedAdmin } from '@/lib/roles';
import { cn } from '@/lib/utils';

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Requests', href: '/requests', icon: ClipboardList },
  { name: 'Courier', href: '/courier', icon: Truck },
  { name: 'Assets', href: '/assets', icon: Package },
  { name: 'Joining Kit', href: '/joining-kit', icon: Gift },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'ID Cards', href: '/id-cards', icon: CreditCard },
  { name: 'AMC', href: '/amc', icon: Wrench },
  { name: 'Seating', href: '/seating', icon: Armchair },
  { name: 'Brochures', href: '/brochures', icon: BookOpen },
  { name: 'PG Records', href: '/pg-records', icon: Home },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

const adminNav = [
  { name: 'Branches', href: '/branches', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Departments', href: '/departments', icon: Building },
  { name: 'Vendors', href: '/vendors', icon: Store },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Import', href: '/import', icon: Upload },
  { name: 'Audit Logs', href: '/audit-logs', icon: ScrollText },
  { name: 'Office Locations', href: '/office-locations', icon: MapPin },
  { name: 'Office Boy Staff', href: '/office-boy-staff', icon: UserCog },
  { name: 'OB Attendance', href: '/office-boy-attendance', icon: ClipboardCheck },
  { name: 'OB Corrections', href: '/attendance-corrections', icon: ClipboardCheck },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isAdmin = isPrivilegedAdmin(user?.role);

  const NavLink = ({ item }: { item: (typeof mainNav)[0] }) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        href={item.href}
        onClick={() => onNavigate?.()}
        title={item.name}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors md:justify-center lg:justify-start',
          active
            ? 'bg-brand-red/10 text-brand-red'
            : 'text-gray-500 hover:bg-surface-muted hover:text-brand-black',
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="truncate md:hidden lg:inline">{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="flex h-full w-[min(280px,88vw)] flex-col border-r border-black/5 bg-white shadow-xl md:w-20 lg:w-64">
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-black/5 lg:justify-start lg:px-6">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg brand-gradient text-sm font-bold text-white">
          N
        </div>
        <div className="ml-3 hidden min-w-0 lg:block">
          <p className="text-lg font-bold tracking-tight text-brand-black">NeoSOFT</p>
          <p className="truncate text-[11px] text-text-muted">Support App</p>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto p-3">
        <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted lg:block">
          Modules
        </p>
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <p className="mb-2 mt-5 hidden px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted lg:block">
              Administration
            </p>
            <ul className="mt-1 space-y-0.5">
              {adminNav.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
}
