import { getAttendanceStatusTone } from '@/lib/attendance-rules';

const toneClasses = {
  green: 'bg-accent-green/10 text-accent-green',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-brand-red/10 text-brand-red-bright',
  gray: 'bg-gray-100 text-gray-600',
};

export function AttendanceStatusBadge({
  label,
  status,
  size = 'md',
}: {
  label: string;
  status: string;
  size?: 'sm' | 'md';
}) {
  const tone = getAttendanceStatusTone(status);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex rounded-full font-semibold ${sizeClass} ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
