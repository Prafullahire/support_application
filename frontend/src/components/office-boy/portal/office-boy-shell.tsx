import { OfficeBoySidebar } from '@/components/office-boy/portal/sidebar';

export function OfficeBoyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-muted md:bg-[#f4f5f7]">
      <OfficeBoySidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">{children}</div>
    </div>
  );
}
