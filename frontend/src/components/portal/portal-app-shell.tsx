import { cn } from '@/lib/utils';

/** Office Boy portal — full width on desktop, same UI on mobile. */
export function PortalAppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'font-portal flex min-h-screen w-full flex-col bg-[#fcfcfc]',
        className,
      )}
    >
      {children}
    </div>
  );
}
