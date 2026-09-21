export function getMonthRange(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthStr = String(month + 1).padStart(2, '0');
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    startDate: `${year}-${monthStr}-01`,
    endDate: `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`,
  };
}

export function formatPortalHeaderDate(date = new Date()) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatPortalTableDate(date: string | Date) {
  const value = new Date(date);
  const day = value.getDate().toString().padStart(2, '0');
  const month = value.toLocaleDateString('en-IN', { month: 'short' });
  const year = value.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatPortalWorkingHours(
  record?: {
    loginTime?: string | null;
    workingDurationMinutes?: number | null;
    totalWorkingMinutes?: number | null;
    workingDurationFormatted?: string | null;
  } | null,
  isActive?: boolean,
  now = Date.now(),
) {
  if (!isActive && record?.workingDurationFormatted) return record.workingDurationFormatted;
  if (!record?.loginTime) return record?.workingDurationFormatted ?? '—';
  if (!isActive) return record?.workingDurationFormatted ?? '—';

  const accumulated = record?.workingDurationMinutes ?? 0;
  const sessionMins = Math.floor((now - new Date(record.loginTime).getTime()) / 60000);
  const total = accumulated + sessionMins;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} Hrs`;
}
