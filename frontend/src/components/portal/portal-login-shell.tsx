import { cn } from '@/lib/utils';

/**
 * Figma login: full-screen gradient on desktop,
 * same centered mobile column (~390px) for the form.
 */
export function PortalLoginShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="font-portal flex min-h-screen w-full justify-center portal-gradient">
      <div
        className={cn(
          'relative flex min-h-screen w-full max-w-[390px] flex-col px-5 py-10',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
