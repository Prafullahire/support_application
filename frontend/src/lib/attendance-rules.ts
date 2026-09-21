/** Standard full working day = 9 hours */
export const FULL_DAY_HOURS = 9;
export const FULL_DAY_MINUTES = FULL_DAY_HOURS * 60;
/** Early leave threshold = 7 hours (left ~2 hours before full day) */
export const EARLY_LEAVE_MIN_HOURS = 7;
/** Half day threshold = 4.5 hours */
export const HALF_DAY_MIN_HOURS = 4.5;
/** Office shift starts at 9:00 AM */
export const SHIFT_START_HOUR = 9;
export const SHIFT_START_MINUTE = 0;
export const LATE_GRACE_MINUTES = 0;

export function isLateForCheckIn(date = new Date()): boolean {
  const shiftStart = new Date(date);
  shiftStart.setHours(SHIFT_START_HOUR, SHIFT_START_MINUTE + LATE_GRACE_MINUTES, 0, 0);
  return date.getTime() > shiftStart.getTime();
}

export function isEarlyLeaveForCheckOut(
  loginTime: string | Date,
  now = new Date(),
  accumulatedMinutes = 0,
): boolean {
  const login = new Date(loginTime);
  const sessionMinutes = Math.floor((now.getTime() - login.getTime()) / 60000);
  return accumulatedMinutes + sessionMinutes < FULL_DAY_MINUTES;
}

export function getAttendanceStatusTone(status: string): 'green' | 'amber' | 'red' | 'gray' {
  switch (status) {
    case 'FULL_DAY':
    case 'PRESENT':
      return 'green';
    case 'HALF_DAY':
    case 'EARLY_LEAVE':
      return 'amber';
    case 'LATE':
      return 'red';
    default:
      return 'gray';
  }
}
