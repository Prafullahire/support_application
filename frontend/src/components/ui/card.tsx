import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  accent?: 'red' | 'black' | 'none';
}

export function Card({ children, className, title, action, accent = 'none' }: CardProps) {
  const accentBorder = {
    red: 'border-t-4 border-t-brand-red',
    black: 'border-t-4 border-t-brand-black',
    none: '',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white shadow-card',
        accentBorder[accent],
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-surface-muted px-5 py-4 md:px-6">
          {title && <h3 className="text-base font-semibold text-brand-black">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
