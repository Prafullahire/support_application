import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { MobileMenu } from '@/components/office-boy/portal/mobile-menu';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="brand-gradient px-5 pb-8 pt-6 text-white md:mx-6 md:mt-6 md:rounded-2xl md:px-8 md:pb-8 md:pt-7 lg:mx-8 lg:mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Go back"
              className="-ml-1.5 grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">
            {eyebrow}
          </p>
        </div>
        <MobileMenu />
      </div>

      <h1 className="mt-1 text-xl font-bold md:text-2xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-white/70 md:text-base">{subtitle}</p>}
    </header>
  );
}
