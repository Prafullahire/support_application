'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Package,
  Receipt,
  Wrench,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { OfficeBoyAttendanceSection } from '@/components/dashboard/office-boy-attendance-section';
import { useAuthStore } from '@/lib/auth-store';
import { isPrivilegedAdmin } from '@/lib/roles';
import { dashboardApi, DashboardStats } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';

const statCards = [
  { key: 'totalRequests', label: 'Total Requests', icon: ClipboardList, style: 'bg-brand-black text-white', href: '/requests' },
  { key: 'pendingRequests', label: 'Pending Requests', icon: AlertTriangle, style: 'bg-brand-red text-white', href: '/requests' },
  { key: 'completedRequests', label: 'Completed', icon: ClipboardList, style: 'bg-white text-brand-black border-2 border-brand-black', href: '/requests' },
  { key: 'totalAssets', label: 'Total Assets', icon: Package, style: 'bg-brand-black text-white', href: '/assets' },
  { key: 'availableAssets', label: 'Available Assets', icon: Package, style: 'bg-white text-brand-black border-2 border-brand-red', href: '/assets' },
  { key: 'totalExpenses', label: 'Total Expenses', icon: Receipt, style: 'bg-brand-red-bright text-white', href: '/expenses', format: 'currency' },
  { key: 'expiringAmc', label: 'Expiring AMC', icon: Wrench, style: 'bg-brand-black text-white', href: '/amc' },
  { key: 'lowStockItems', label: 'Low Stock Items', icon: AlertTriangle, style: 'bg-brand-red text-white', href: '/brochures' },
  { key: 'unreadNotifications', label: 'Notifications', icon: Bell, style: 'bg-white text-brand-black border-2 border-brand-black', href: '/notifications' },
] as const;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = isPrivilegedAdmin(user?.role);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then(setStats)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState height="h-64" />;
  }

  if (error) {
    return <ErrorBanner error={`Failed to load dashboard: ${error}`} onDismiss={() => setError('')} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="Overview of support team operations" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const value = stats?.[card.key] ?? 0;
          const display =
            'format' in card && card.format === 'currency'
              ? formatCurrency(value)
              : value.toLocaleString();

          return (
            <Link key={card.key} href={card.href}>
              <div className="stat-card group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-3 shadow-md transition-transform group-hover:scale-105 ${card.style}`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-muted">{card.label}</p>
                    <p className="text-2xl font-bold text-brand-black">{display}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {isAdmin && <OfficeBoyAttendanceSection />}
    </div>
  );
}
