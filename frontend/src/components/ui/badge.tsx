import { cn, formatAttendanceStatus } from '@/lib/utils';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-neutral-100 text-neutral-800 border border-neutral-300',
  SUBMITTED: 'bg-white text-black border border-black',
  UNDER_REVIEW: 'bg-neutral-100 text-black border border-neutral-400',
  IN_PROGRESS: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
  COMPLETED: 'bg-black text-white',
  REJECTED: 'bg-brand-red text-white',
  CANCELLED: 'bg-neutral-200 text-neutral-700',
  ON_HOLD: 'bg-white text-brand-red border border-brand-red',
  AVAILABLE: 'bg-white text-black border border-black',
  ASSIGNED: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
  RETURNED: 'bg-neutral-100 text-black',
  DAMAGED: 'bg-brand-red text-white',
  UNDER_REPAIR: 'bg-neutral-800 text-white',
  LOST: 'bg-black text-white',
  ACTIVE: 'bg-brand-red text-white',
  EXPIRED: 'bg-neutral-800 text-white',
  RENEWED: 'bg-white text-black border border-black',
  CLOSED: 'bg-neutral-200 text-neutral-700',
  BOOKED: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
  PICKED_UP: 'bg-neutral-100 text-black',
  IN_TRANSIT: 'bg-white text-black border border-neutral-400',
  DELIVERED: 'bg-black text-white',
  PRESENT: 'bg-black text-white',
  FULL_DAY: 'bg-black text-white',
  HALF_DAY: 'bg-amber-100 text-amber-900 border border-amber-300',
  EARLY_LEAVE: 'bg-orange-100 text-orange-900 border border-orange-300',
  INCOMPLETE: 'bg-white text-brand-red border border-brand-red',
  ABSENT: 'bg-neutral-200 text-neutral-700',
  PARTIAL: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
  LATE: 'bg-neutral-800 text-white',
  REJECTED_LOCATION: 'bg-brand-red text-white',
  HOLIDAY: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
  PENDING: 'bg-amber-100 text-amber-900 border border-amber-300',
  SUPER_ADMIN: 'bg-brand-red text-white',
  ADMIN: 'bg-black text-white',
  OFFICE_BOY: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
};

export function Badge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        statusColors[status] || 'bg-neutral-100 text-black border border-neutral-300',
        className,
      )}
    >
      {formatAttendanceStatus(status, label)}
    </span>
  );
}
