import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(amount));
}

export function formatTime(date: string | Date | null | undefined) {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateTime(date: string | Date | null | undefined) {
  if (!date) return '—';
  const value = new Date(date);
  return value.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const SYSTEM_EMAIL_DOMAINS = ['@staff.local', '@register.local'];

export function isSystemGeneratedEmail(email?: string | null) {
  if (!email) return false;
  const lower = email.toLowerCase();
  return SYSTEM_EMAIL_DOMAINS.some((domain) => lower.endsWith(domain));
}

export function getUserDisplayEmail(user: { email?: string | null }) {
  if (!user.email || isSystemGeneratedEmail(user.email)) return '—';
  return user.email;
}

export function getUserDisplayPhone(user: { phone?: string | null }) {
  if (!user.phone?.trim()) return '—';
  return user.phone;
}

export function formatAttendanceStatus(status: string, statusLabel?: string | null) {
  if (statusLabel) return statusLabel;
  const labels: Record<string, string> = {
    FULL_DAY: 'Full Day',
    HALF_DAY: 'Half Day',
    EARLY_LEAVE: 'Early Leave',
    PRESENT: 'Full Day',
    INCOMPLETE: 'Incomplete',
    ABSENT: 'Absent',
    LATE: 'Late',
    PARTIAL: 'Partial',
    REJECTED_LOCATION: 'Rejected Location',
    IN_PROGRESS: 'Working',
    ON_HOLD: 'Incomplete',
    COMPLETED: 'Completed',
  };
  return labels[status] || status.replace(/_/g, ' ');
}
