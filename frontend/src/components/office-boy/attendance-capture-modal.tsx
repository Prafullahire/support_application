'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { SelfieCapture } from '@/components/office-boy/selfie-capture';
import { isEarlyLeaveForCheckOut, isLateForCheckIn } from '@/lib/attendance-rules';

export type AttendanceCaptureMode = 'check-in' | 'check-out';

export function AttendanceCaptureModal({
  open,
  mode,
  loginTime,
  accumulatedMinutes = 0,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  mode: AttendanceCaptureMode;
  loginTime?: string | null;
  accumulatedMinutes?: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (photo: string, reason?: string) => void;
}) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const reasonConfig = useMemo(() => {
    if (mode === 'check-in' && isLateForCheckIn()) {
      return {
        required: true,
        title: 'Reason for late arrival',
        hint: 'You are signing in after 9:00 AM. Please explain why you are late.',
        placeholder: 'Why are you late today?',
      };
    }

    if (mode === 'check-out' && loginTime && isEarlyLeaveForCheckOut(loginTime, new Date(), accumulatedMinutes)) {
      return {
        required: true,
        title: 'Reason for early sign out',
        hint: 'You are signing out before completing 9 working hours. Please explain why you are leaving early.',
        placeholder: 'Why are you leaving early today?',
      };
    }

    return null;
  }, [mode, loginTime, accumulatedMinutes]);

  useEffect(() => {
    if (open) {
      setPhoto(null);
      setReason('');
    }
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const title = mode === 'check-in' ? 'Capture photo to Sign In' : 'Capture photo to Sign Out';
  const confirmLabel = mode === 'check-in' ? 'Confirm Sign In' : 'Confirm Sign Out';
  const canConfirm =
    !!photo && !loading && (!reasonConfig?.required || reason.trim().length >= 3);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-6">
        <div className="flex w-full max-w-md max-h-[min(92dvh,calc(100dvh-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[90dvh]">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-brand-black">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-surface-muted"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {reasonConfig && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                {reasonConfig.hint}
              </div>
            )}

            <SelfieCapture photo={photo} onPhotoChange={setPhoto} disabled={loading} />

            {reasonConfig && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600">
                  {reasonConfig.title}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={reasonConfig.placeholder}
                  rows={3}
                  disabled={loading}
                  className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
                />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-gray-100 px-5 py-4">
            <button
              type="button"
              disabled={!canConfirm}
              onClick={() =>
                photo && onConfirm(photo, reasonConfig?.required ? reason.trim() : undefined)
              }
              className="w-full rounded-lg bg-brand-black py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
