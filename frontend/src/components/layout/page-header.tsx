'use client';

import { ReactNode } from 'react';
import { AdminUserMenu } from '@/components/layout/admin-user-menu';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  showUserMenu?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  showUserMenu = true,
}: PageHeaderProps) {
  return (
    <div className="brand-gradient -mx-4 flex items-center justify-between gap-3 px-4 py-3.5 text-white sm:-mx-6 sm:px-6 md:mx-0 md:rounded-xl md:px-5 md:py-4">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="text-[10px] font-medium uppercase tracking-wide text-white/60">{eyebrow}</p>
        )}
        <h1 className={`font-semibold text-base md:text-lg ${eyebrow ? 'mt-0.5' : ''}`}>{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-white/70">{subtitle}</p>}
      </div>

      {(actions || showUserMenu) && (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {showUserMenu && <AdminUserMenu />}
        </div>
      )}
    </div>
  );
}
