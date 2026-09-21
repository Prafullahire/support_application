'use client';

import { OfficeBoyGuard } from '@/components/auth-guard';
import { OfficeBoyShell } from '@/components/office-boy/portal/office-boy-shell';

export default function OfficeBoyDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <OfficeBoyGuard>
      <OfficeBoyShell>{children}</OfficeBoyShell>
    </OfficeBoyGuard>
  );
}