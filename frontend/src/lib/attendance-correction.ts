export const ATTENDANCE_CORRECTION_TYPES = [
  { value: 'PRESENT_FULL_DAY', label: 'Present (Full Day)' },
  {
    value: 'PRESENT_FULL_DAY_NOT_COMPLETED_9H',
    label: 'Present (Full Day - Not Completed 9 hrs)',
  },
  { value: 'PRESENT_HALF_DAY', label: 'Present (Half Day)' },
  { value: 'ABSENT_INFORMED_SENIOR', label: 'Absent (Informed Senior)' },
  { value: 'HOLIDAY', label: 'Holiday' },
] as const;

export type AttendanceCorrectionType =
  (typeof ATTENDANCE_CORRECTION_TYPES)[number]['value'];

export function getCorrectionTypeLabel(type: string): string {
  return (
    ATTENDANCE_CORRECTION_TYPES.find((item) => item.value === type)?.label ??
    type.replace(/_/g, ' ')
  );
}
