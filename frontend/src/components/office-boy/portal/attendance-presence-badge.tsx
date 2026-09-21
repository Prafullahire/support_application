export function AttendancePresenceBadge({ present }: { present: boolean }) {
  return (
    <span
      className="inline-flex min-w-[62px] items-center justify-center rounded-full bg-brand-red-bright/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-red-bright md:min-w-[72px] md:px-2.5 md:py-1 md:text-[10px] lg:min-w-[84px] lg:px-3 lg:text-[11px]"
      aria-label={present ? 'Present' : 'Absent'}
    >
      {present ? 'Present' : 'Absent'}
    </span>
  );
}
