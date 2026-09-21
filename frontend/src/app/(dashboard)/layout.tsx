'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-surface-muted md:bg-[#f4f5f7]">
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 md:static md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-brand-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="-mt-1 min-h-full rounded-t-3xl bg-white px-4 pb-8 pt-5 sm:px-6 md:mt-0 md:rounded-none md:bg-transparent md:px-6 md:pb-10 lg:px-8">
              <div className="mx-auto w-full max-w-[1600px]">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
