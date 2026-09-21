import { cn } from '@/lib/utils';

interface NSLogoProps {
  variant?: 'sidebar' | 'auth' | 'header';
  showTagline?: boolean;
  className?: string;
}

export function NSLogo({ variant = 'sidebar', showTagline = true, className }: NSLogoProps) {
  const isDark = variant === 'sidebar' || variant === 'auth';
  const taglineColor = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const titleColor = isDark ? 'text-white' : 'text-black';

  const iconSize = variant === 'header' ? 'h-8 w-8' : 'h-10 w-10';
  const titleSize = variant === 'header' ? 'text-base' : 'text-lg';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg bg-primary-600 shadow-lg',
          iconSize,
        )}
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="h-[70%] w-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 30V10h5.5l7 11.2V10H24v20h-5.4l-7.1-11.4V30H6z"
            fill="#FFFFFF"
          />
          <path
            d="M27 16.5c0-2.8 2.2-4.3 5.8-4.3 3.3 0 5.4 1.4 5.4 3.8 0 2.1-1.5 3.4-4.2 4l-2.9.7c-2.9.7-4.5 2.1-4.5 4.9s2.2 5.1 6.6 5.1 6.8-2.1 6.8-5.1H42c0 1.6-1.2 2.5-2.9 2.5s-3-.8-3-2.2 1.2-2.9 4.4-3.6l2.9-.7c3-.8 4.6-2.3 4.6-5.2 0-3.6-2.9-5.7-7.3-5.7-4.7 0-7.7 2.3-7.7 5.9H27z"
            fill="#0A0A0A"
            transform="translate(-2, 2) scale(0.55)"
          />
        </svg>
      </div>

      <div className="min-w-0">
        <p className={cn('font-bold tracking-wide', titleSize, titleColor)}>NS</p>
        {showTagline && (
          <p className={cn('text-[11px] leading-tight', taglineColor)}>Management System</p>
        )}
      </div>
    </div>
  );
}

export function NSLogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NS"
    >
      <rect width="40" height="40" rx="10" fill="#0A0A0A" />
      <path d="M7 29V11h5.5l7 11.2V11H25v18h-5.4l-7.1-11.4V29H7z" fill="#DC2626" />
      <path
        d="M28 17.5c0-2.8 2.2-4.3 5.8-4.3 3.3 0 5.4 1.4 5.4 3.8 0 2.1-1.5 3.4-4.2 4l-2.9.7c-2.9.7-4.5 2.1-4.5 4.9s2.2 5.1 6.6 5.1 6.8-2.1 6.8-5.1H43c0 1.6-1.2 2.5-2.9 2.5s-3-.8-3-2.2 1.2-2.9 4.4-3.6l2.9-.7c3-.8 4.6-2.3 4.6-5.2 0-3.6-2.9-5.7-7.3-5.7-4.7 0-7.7 2.3-7.7 5.9H28z"
        fill="#FFFFFF"
        transform="translate(-1, 1) scale(0.55)"
      />
    </svg>
  );
}

export function NSLogoFull({ className, theme = 'light' }: { className?: string; theme?: 'light' | 'dark' }) {
  const nColor = '#DC2626';
  const sColor = theme === 'dark' ? '#FFFFFF' : '#0A0A0A';

  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NS"
    >
      <path d="M4 40V8h8l12 19.2V8h8v32h-8L12 20.8V40H4z" fill={nColor} />
      <path
        d="M44 18c0-4.5 3.5-7 9.2-7 5.2 0 8.6 2.2 8.6 6.2 0 3.4-2.4 5.6-6.8 6.6l-4.8 1.2c-4.8 1.2-7.4 3.5-7.4 8.2s3.6 8.6 10.8 8.6 11.2-3.5 11.2-8.6h-7.2c0 2.6-2 4.2-4.8 4.2s-5-1.6-5-3.8 1.9-4.8 7.2-6l4.8-1.2c5-1.2 7.6-3.8 7.6-8.6 0-6-4.8-9.6-12.2-9.6-7.8 0-12.8 3.8-12.8 9.8H44z"
        fill={sColor}
      />
    </svg>
  );
}
