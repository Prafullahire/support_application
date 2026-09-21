export type OfficeBoyNavItem = {
  label: string;
  href: string;
};

export const officeBoyNavItems: OfficeBoyNavItem[] = [
  { label: 'Daily Attendance', href: '/office-boy/dashboard' },
  { label: 'Monthly Report', href: '/office-boy/dashboard/history' },
  { label: 'Daily Checklist', href: '/office-boy/dashboard/checklist' },
  { label: 'Profile', href: '/office-boy/dashboard/profile' },
  { label: 'Attendance Approval', href: '/office-boy/dashboard/approval' },
];
