export function HourBadge({
  value,
  size = 'md',
}: {
  value: string;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-accent-green font-semibold text-white ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-5 py-2.5 text-[13px]'
      }`}
    >
      {value}
    </span>
  );
}
