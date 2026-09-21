'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { attendanceApi, AttendanceRecord, OfficeBoyDashboard } from '@/lib/api';
import { getCurrentPosition } from '@/lib/geolocation';
import { getMonthRange } from '@/lib/portal';
import {
  getOfficeBoyCheckInPhoto,
  getOfficeBoyCheckOutPhoto,
  getOfficeBoyDisplayPhoto,
  saveOfficeBoyCheckInPhoto,
  saveOfficeBoyCheckOutPhoto,
} from '@/lib/office-boy-photo';
import { toast } from 'sonner';

const SESSION_MS = 30 * 60 * 1000;

const EMPTY_HISTORY_FILTERS = {
  period: '',
  startDate: '',
  endDate: '',
  status: '',
};

function readCachedAttendance(): AttendanceRecord | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem('officeBoyLastAttendance');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AttendanceRecord;
  } catch {
    return null;
  }
}

export function useOfficeBoyAttendance() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [data, setData] = useState<OfficeBoyDashboard | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyFilters, setHistoryFilters] = useState(EMPTY_HISTORY_FILTERS);
  const [appliedHistoryFilters, setAppliedHistoryFilters] = useState(EMPTY_HISTORY_FILTERS);
  const [loginPhoto, setLoginPhoto] = useState<string | null>(null);
  const [checkOutPhoto, setCheckOutPhoto] = useState<string | null>(null);
  const [historyMonth, setHistoryMonth] = useState(() => new Date());
  const [clockTick, setClockTick] = useState(() => Date.now());
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const refreshStoredPhotos = useCallback((attendance?: AttendanceRecord | null) => {
    const storedLogin = getOfficeBoyDisplayPhoto()?.dataUrl ?? null;
    const storedCheckout = getOfficeBoyCheckOutPhoto()?.dataUrl ?? null;
    setLoginPhoto(attendance?.loginPhotoUrl ?? storedLogin);
    setCheckOutPhoto(attendance?.logoutPhotoUrl ?? storedCheckout);
  }, []);

  useEffect(() => {
    refreshStoredPhotos();
  }, [refreshStoredPhotos]);

  const loadDashboard = useCallback(async () => {
    try {
      const dashboard = await attendanceApi.dashboard();
      setData(dashboard);
      refreshStoredPhotos(dashboard.todayAttendance);
      if (typeof window !== 'undefined') {
        if (dashboard.todayAttendance?.loginTime || dashboard.todayAttendance?.logoutTime) {
          sessionStorage.setItem(
            'officeBoyLastAttendance',
            JSON.stringify(dashboard.todayAttendance),
          );
        } else {
          sessionStorage.removeItem('officeBoyLastAttendance');
        }
      }
    } catch (err) {
      const cached = readCachedAttendance();
      if (cached) {
        setData({
          user: {
            id: user?.id || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            employeeId: user?.employeeId || '',
            branch: user?.branch
              ? { id: user.branch.id, name: user.branch.name }
              : { id: '', name: '' },
            officeLocation: user?.officeLocation
              ? {
                  id: user.officeLocation.id,
                  name: user.officeLocation.name,
                  allowedRadiusMeters: user.officeLocation.allowedRadiusMeters || 0,
                }
              : { id: '', name: '', allowedRadiusMeters: 0 },
          },
          todayAttendance: cached,
          history: [cached],
          isLoggedIn: cached.isSessionActive ?? false,
        });
      }
      const message = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(message);
      if (!cached) toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user?.branch, user?.employeeId, user?.firstName, user?.id, user?.lastName, user?.officeLocation]);

  const loadHistory = useCallback(
    async (filters: typeof appliedHistoryFilters, monthDate: Date) => {
      setHistoryLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.period) {
          params.period = filters.period;
        } else if (filters.startDate && filters.endDate) {
          params.startDate = filters.startDate;
          params.endDate = filters.endDate;
        } else {
          const range = getMonthRange(monthDate);
          params.startDate = range.startDate;
          params.endDate = range.endDate;
        }
        if (filters.status) {
          params.status = filters.status;
        }
        const records = await attendanceApi.history(params);
        setHistory(records);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setHistoryLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const sessionStart = sessionStorage.getItem('officeBoySessionStart');
    if (!sessionStart) {
      sessionStorage.setItem('officeBoySessionStart', String(Date.now()));
    }

    const checkSession = () => {
      const start = Number(sessionStorage.getItem('officeBoySessionStart') || Date.now());
      if (Date.now() - start >= SESSION_MS) {
        toast.info('Session expired after 30 minutes. Please sign in again.');
        logout().then(() => router.replace('/login'));
      }
    };

    checkSession();
    const timer = setInterval(checkSession, 30000);
    return () => clearInterval(timer);
  }, [logout, router]);

  useEffect(() => {
    const today = data?.todayAttendance;
    const active = (data?.isLoggedIn ?? false) && !today?.logoutTime;
    if (!active) return;
    const timer = setInterval(() => setClockTick(Date.now()), 30000);
    return () => clearInterval(timer);
  }, [data?.isLoggedIn, data?.todayAttendance?.logoutTime]);

  const persistAttendance = (attendance: AttendanceRecord) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('officeBoyLastAttendance', JSON.stringify(attendance));
    }
  };

  const handleCheckIn = async (capturedPhoto?: string, lateReason?: string) => {
    setActionLoading(true);
    setError('');
    try {
      if (capturedPhoto) {
        saveOfficeBoyCheckInPhoto(capturedPhoto);
        refreshStoredPhotos();
      } else if (!getOfficeBoyCheckInPhoto()) {
        throw new Error('Please capture your photo before signing in.');
      }

      const position = await getCurrentPosition();
      const photo = capturedPhoto ?? getOfficeBoyCheckInPhoto()?.dataUrl;
      const result = await attendanceApi.checkIn({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        deviceInfo: navigator.userAgent,
        lateReason,
        photo,
      });
      persistAttendance(result.attendance);
      toast.success('You are logged in');
      await loadDashboard();
      refreshStoredPhotos();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Check-in failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteAttendance = async (capturedPhoto?: string, earlyLeaveReason?: string) => {
    setActionLoading(true);
    setError('');
    try {
      if (capturedPhoto) {
        saveOfficeBoyCheckOutPhoto(capturedPhoto);
        setCheckOutPhoto(capturedPhoto);
        refreshStoredPhotos();
      } else if (!getOfficeBoyCheckOutPhoto()) {
        throw new Error('Please capture your photo before signing out.');
      }

      const position = await getCurrentPosition();
      const photo = capturedPhoto ?? getOfficeBoyCheckOutPhoto()?.dataUrl;
      const result = await attendanceApi.logout({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        deviceInfo: navigator.userAgent,
        earlyLeaveReason,
        photo,
      });
      persistAttendance(result.attendance);
      toast.success(
        result.attendance.isDayComplete
          ? 'Today\'s attendance completed'
          : 'Signed out. You can sign in again to complete 9 hours.',
      );
      await loadDashboard();
      refreshStoredPhotos();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not complete attendance';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyHistoryFilters = () => {
    if (!historyFilters.period && (historyFilters.startDate || historyFilters.endDate)) {
      if (!historyFilters.startDate || !historyFilters.endDate) {
        toast.error('Please select both start date and end date');
        return;
      }
      if (historyFilters.startDate > historyFilters.endDate) {
        toast.error('Start date cannot be after end date');
        return;
      }
    }
    setAppliedHistoryFilters(historyFilters);
    setShowFilters(false);
  };

  const handleClearHistoryFilters = () => {
    const monthRange = getMonthRange(historyMonth);
    const cleared = { ...EMPTY_HISTORY_FILTERS, ...monthRange };
    setHistoryFilters(cleared);
    setAppliedHistoryFilters(cleared);
  };

  const displayHistory = history.length > 0 ? history : data?.history || [];

  const monthFilteredHistory = useMemo(() => {
    if (appliedHistoryFilters.period) return displayHistory;
    const year = historyMonth.getFullYear();
    const month = historyMonth.getMonth();
    return displayHistory.filter((row) => {
      const d = new Date(row.attendanceDate);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [appliedHistoryFilters.period, displayHistory, historyMonth]);

  const monthlySummary = useMemo(() => {
    const year = historyMonth.getFullYear();
    const month = historyMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const presentDays = monthFilteredHistory.filter((r) => r.loginTime).length;
    const absentDays = Math.max(0, daysInMonth - presentDays);
    const durations = monthFilteredHistory
      .filter((r) => r.workingDurationFormatted)
      .map((r) => r.workingDurationFormatted as string);
    let avgHours = '—';
    if (durations.length > 0) {
      const totalMins = durations.reduce((sum, d) => {
        const parts = d.replace(' Hrs', '').split(':').map(Number);
        return sum + (parts[0] || 0) * 60 + (parts[1] || 0);
      }, 0);
      const avg = Math.round(totalMins / durations.length);
      avgHours = `${Math.floor(avg / 60).toString().padStart(2, '0')}:${(avg % 60).toString().padStart(2, '0')}`;
    }
    return {
      presentDays,
      absentDays,
      avgHours,
      month: historyMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };
  }, [historyMonth, monthFilteredHistory]);

  const locationName =
    user?.officeLocation?.name ||
    data?.user.officeLocation?.name ||
    data?.todayAttendance?.location?.name ||
    '';

  const isLoggedIn = data?.isLoggedIn ?? false;

  const displayToday = useMemo(() => {
    const apiToday = data?.todayAttendance;
    const cached = readCachedAttendance();
    if (apiToday?.loginTime || apiToday?.logoutTime) return apiToday;
    if (cached?.loginTime || cached?.logoutTime) return cached;
    return apiToday ?? cached;
  }, [data?.todayAttendance]);

  const today = displayToday;
  const isDayComplete =
    displayToday?.isDayComplete ??
    Boolean(
      displayToday?.logoutTime &&
        (displayToday?.workingDurationMinutes ?? 0) >= 9 * 60,
    );
  const canSignInAgain =
    displayToday?.canSignInAgain ??
    Boolean(
      displayToday?.logoutTime &&
        !displayToday?.isSessionActive &&
        (displayToday?.workingDurationMinutes ?? 0) < 9 * 60,
    );
  const isCompleted = isDayComplete;
  const hasActiveAttendance = Boolean(displayToday?.isSessionActive);
  const showSignInButton = !hasActiveAttendance && !isDayComplete && (!displayToday?.loginTime || canSignInAgain);
  const showSignOutButton = hasActiveAttendance;

  return {
    data,
    loading,
    actionLoading,
    error,
    setError,
    loginPhoto,
    checkOutPhoto,
    refreshStoredPhotos,
    historyMonth,
    setHistoryMonth,
    clockTick,
    historyLoading,
    showFilters,
    setShowFilters,
    historyFilters,
    setHistoryFilters,
    appliedHistoryFilters,
    loadHistory,
    handleApplyHistoryFilters,
    handleClearHistoryFilters,
    monthFilteredHistory,
    monthlySummary,
    locationName,
    today,
    isLoggedIn,
    isCompleted,
    isDayComplete,
    canSignInAgain,
    hasActiveAttendance,
    showSignInButton,
    showSignOutButton,
    handleCheckIn,
    handleCompleteAttendance,
  };
}
