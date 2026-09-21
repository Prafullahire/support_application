'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { PageHeader } from '@/components/office-boy/portal/page-header';
import { AttendanceMap } from '@/components/office-boy/portal/attendance-map';
import { HourBadge } from '@/components/office-boy/portal/hour-badge';
import {
  AttendanceCaptureModal,
  AttendanceCaptureMode,
} from '@/components/office-boy/attendance-capture-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { useOfficeBoyAttendance } from '@/lib/hooks/use-office-boy-attendance';
import { AttendanceStatusBadge } from '@/components/office-boy/portal/attendance-status-badge';
import { formatPortalHeaderDate, formatPortalWorkingHours } from '@/lib/portal';
import { formatTime } from '@/lib/utils';

export default function OfficeBoyDailyPage() {
  const {
    loading,
    actionLoading,
    error,
    setError,
    loginPhoto,
    checkOutPhoto,
    clockTick,
    locationName,
    today,
    isLoggedIn,
    isCompleted,
    showSignInButton,
    showSignOutButton,
    canSignInAgain,
    handleCheckIn,
    handleCompleteAttendance,
  } = useOfficeBoyAttendance();

  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState<AttendanceCaptureMode>('check-in');

  const openCapture = (mode: AttendanceCaptureMode) => {
    setCaptureMode(mode);
    setCaptureOpen(true);
  };

  const handleCaptureConfirm = async (photo: string, reason?: string) => {
    try {
      if (captureMode === 'check-in') {
        await handleCheckIn(photo, reason);
      } else {
        await handleCompleteAttendance(photo, reason);
      }
      setCaptureOpen(false);
    } catch {
      // error shown via hook
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <LoadingState height="h-40" message="Loading attendance..." />
      </div>
    );
  }

  const workingHours = formatPortalWorkingHours(
    today,
    isLoggedIn && !isCompleted,
    clockTick,
  );

  const canCapture = showSignInButton || showSignOutButton;
  const captureTargetMode: AttendanceCaptureMode = showSignInButton ? 'check-in' : 'check-out';

  return (
    <>
      <PageHeader
        eyebrow="Daily"
        title="Attendance"
        subtitle={formatPortalHeaderDate()}
      />

      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
        {error && (
          <div className="mb-4">
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          </div>
        )}

        {canCapture && (
          <p className="mb-4 text-center text-xs text-text-muted md:hidden">
            Capture your photo using the camera, then tap Sign In or Sign Out.
          </p>
        )}

        <div className="md:grid md:grid-cols-5 md:items-stretch md:gap-8">
          <div className="md:col-span-3">
            <AttendanceMap
              className="h-56 sm:h-72 md:h-full md:min-h-[380px]"
              locationName={locationName}
            />
          </div>

          <div className="mt-6 flex flex-col md:col-span-2 md:mt-0 md:min-h-[380px]">
            {/* Mobile */}
            <div className="grid grid-cols-3 items-center md:hidden">
              <div className="flex justify-center">
                <ProfilePhoto photo={loginPhoto} size="lg" />
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="mb-2 text-[11px] font-medium text-text-muted">Working Hours</p>
                <HourBadge value={workingHours} />
              </div>
              <div className="flex justify-center">
                <SignOutPhotoSlot
                  size="lg"
                  photo={checkOutPhoto}
                  interactive={canCapture}
                  disabled={actionLoading}
                  onClick={() => openCapture(captureTargetMode)}
                />
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden rounded-2xl bg-surface-muted p-5 md:grid md:grid-cols-3 md:items-center">
              <div className="flex justify-start">
                <ProfilePhoto photo={loginPhoto} size="sm" />
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-xs text-text-muted">Working Hours</p>
                <div className="mt-1">
                  <HourBadge value={workingHours} />
                </div>
              </div>
              <div className="flex justify-end">
                <SignOutPhotoSlot
                  size="sm"
                  photo={checkOutPhoto}
                  interactive={canCapture}
                  disabled={actionLoading}
                  onClick={() => openCapture(captureTargetMode)}
                />
              </div>
            </div>

            {canCapture && (
              <p className="mt-3 hidden text-xs text-text-muted md:block">
                Tap the camera to capture your photo before signing in or signing out.
              </p>
            )}

            <div className="mt-6 flex items-center justify-between md:mt-5 md:rounded-2xl md:border md:border-gray-100 md:p-5">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                  Sign In
                </p>
                <p className="mt-1 text-[13px] font-semibold text-accent-green md:text-lg">
                  {formatTime(today?.loginTime)}
                </p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1.5 text-xs text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                  Sign Out
                </p>
                <p className="mt-1 text-[13px] font-semibold text-brand-red-bright md:text-lg">
                  {formatTime(today?.logoutTime)}
                </p>
              </div>
            </div>

            {(isCompleted || today?.isLate || today?.lateReason || today?.earlyLeaveReason) && (
              <div className="mt-4 space-y-2 text-center">
                {isCompleted && (
                  <p className="text-sm font-medium text-accent-green">
                    Attendance completed for today
                  </p>
                )}
                {today?.statusLabel && isCompleted && (
                  <div>
                    <AttendanceStatusBadge
                      label={today.statusLabel}
                      status={today.status}
                      size="md"
                    />
                  </div>
                )}
                {today?.lateReason && (
                  <p className="text-xs text-text-muted">
                    Late arrival reason: {today.lateReason}
                  </p>
                )}
                {today?.earlyLeaveReason && (
                  <p className="text-xs text-text-muted">
                    Early sign out reason: {today.earlyLeaveReason}
                  </p>
                )}
              </div>
            )}

            {canSignInAgain && (
              <p className="mt-4 text-center text-xs text-amber-700">
                You signed out before 9 hours. Sign in again to continue today&apos;s attendance.
              </p>
            )}

            {showSignInButton && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => openCapture('check-in')}
                className="mt-8 w-full rounded-lg bg-brand-black py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:mt-auto"
              >
                Sign In
              </button>
            )}

            {showSignOutButton && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => openCapture('check-out')}
                className="mt-8 w-full rounded-lg bg-brand-black py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:mt-auto"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </main>

      <AttendanceCaptureModal
        open={captureOpen}
        mode={captureMode}
        loginTime={today?.loginTime}
        accumulatedMinutes={today?.workingDurationMinutes ?? 0}
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) setCaptureOpen(false);
        }}
        onConfirm={handleCaptureConfirm}
      />
    </>
  );
}

function ProfilePhoto({
  photo,
  size,
}: {
  photo: string | null;
  size: 'sm' | 'lg';
}) {
  const classes =
    size === 'lg'
      ? 'h-[76px] w-[76px] border-[3px]'
      : 'h-11 w-11 border-0';

  return (
    <div
      className={`overflow-hidden rounded-full ${classes} ${
        photo ? 'border-accent-green' : 'border-gray-200 bg-gray-100'
      }`}
    >
      {photo ? (
        <img src={photo} alt="Captured photo" className="h-full w-full object-cover" />
      ) : null}
    </div>
  );
}

function SignOutPhotoSlot({
  size,
  photo,
  interactive,
  disabled,
  onClick,
}: {
  size: 'sm' | 'lg';
  photo: string | null;
  interactive: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const dimension = size === 'lg' ? 'h-[76px] w-[76px]' : 'h-11 w-11';
  const border = size === 'lg' ? 'border-[3px]' : 'border-2';

  if (photo) {
    const frame = (
      <div
        className={`${dimension} overflow-hidden rounded-full ${border} border-brand-red-bright`}
      >
        <img src={photo} alt="Sign out photo" className="h-full w-full object-cover" />
      </div>
    );

    if (!interactive || disabled) {
      return frame;
    }

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="disabled:opacity-50"
        aria-label="Retake sign out photo"
      >
        {frame}
      </button>
    );
  }

  const buttonClass =
    size === 'lg'
      ? 'h-[76px] w-[76px] rounded-full border-[3px] border-gray-200 bg-white'
      : 'h-11 w-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50';

  return (
    <button
      type="button"
      aria-label="Capture sign out photo"
      onClick={onClick}
      disabled={disabled || !interactive}
      className={`grid place-items-center text-gray-500 transition-colors disabled:opacity-50 ${buttonClass}`}
    >
      <Camera className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
    </button>
  );
}
