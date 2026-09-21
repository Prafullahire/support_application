'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/office-boy/portal/page-header';
import { HourBadge } from '@/components/office-boy/portal/hour-badge';
import { AttendanceStatusBadge } from '@/components/office-boy/portal/attendance-status-badge';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { attendanceApi, attendanceCorrectionsApi, AttendanceRecord } from '@/lib/api';
import { ATTENDANCE_CORRECTION_TYPES } from '@/lib/attendance-correction';
import { formatPortalTableDate } from '@/lib/portal';
import { formatTime } from '@/lib/utils';
import { toast } from 'sonner';

export default function AttendanceMoreInfoPage() {
  const params = useParams<{ attendanceId: string }>();
  const router = useRouter();
  const attendanceId = params.attendanceId;

  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [requestType, setRequestType] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const dashboard = await attendanceApi.dashboard();
        const fromToday =
          dashboard.todayAttendance?.id === attendanceId ? dashboard.todayAttendance : null;
        const fromHistory = dashboard.history.find((row) => row.id === attendanceId) ?? null;
        const found = fromToday || fromHistory;

        if (!found) {
          const history = await attendanceApi.history();
          const match = history.find((row) => row.id === attendanceId) ?? null;
          if (!match) {
            setError('Attendance record not found');
            return;
          }
          setRecord(match);
          return;
        }

        setRecord(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [attendanceId]);

  const pendingRequest = record?.correctionRequest?.status === 'PENDING'
    ? record.correctionRequest
    : null;

  const isLocked = Boolean(
    pendingRequest || record?.approvedCorrectionType,
  );

  useEffect(() => {
    if (record?.correctionRequest) {
      setRequestType(record.correctionRequest.requestType);
      setComments(record.correctionRequest.comments);
    }
  }, [record?.correctionRequest]);

  const workingHours = useMemo(() => {
    if (record?.workingDurationFormatted) return record.workingDurationFormatted;
    if (!record?.loginTime) return '—';
    const mins = Math.floor((Date.now() - new Date(record.loginTime).getTime()) / 60000);
    const accumulated = record.workingDurationMinutes ?? 0;
    const total = record.isSessionActive ? accumulated + mins : accumulated;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} Hrs`;
  }, [record]);

  const handleSubmit = async () => {
    if (!record) return;
    if (!requestType) {
      toast.error('Please select a request type');
      return;
    }
    if (comments.trim().length < 3) {
      toast.error('Please enter comments (at least 3 characters)');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await attendanceCorrectionsApi.create({
        attendanceId: record.id,
        requestType,
        comments: comments.trim(),
      });
      toast.success('Request submitted. Admin will review it.');
      router.push('/office-boy/dashboard/checklist');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit request';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <LoadingState height="h-40" message="Loading details..." />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6">
        <ErrorBanner error={error || 'Attendance record not found'} />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Daily"
        title="More Info"
        subtitle={formatPortalTableDate(record.attendanceDate)}
        backHref="/office-boy/dashboard/checklist"
      />

      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
        {error && (
          <div className="mb-4">
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard label="Date" value={formatPortalTableDate(record.attendanceDate)} />
          <InfoCard label="Sign In" value={record.loginTime ? formatTime(record.loginTime) : '—'} />
          <InfoCard label="Sign Out" value={record.logoutTime ? formatTime(record.logoutTime) : '—'} />
          <div className="rounded-2xl border border-gray-100 bg-surface-muted p-4">
            <p className="text-xs text-text-muted">Total Hours</p>
            <div className="mt-2">
              <HourBadge value={workingHours} size="sm" />
            </div>
          </div>
        </div>

        {record.statusLabel && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-text-muted">Current Status</p>
            <AttendanceStatusBadge
              label={record.statusLabel}
              status={record.status}
              size="md"
            />
          </div>
        )}

        {pendingRequest && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Your correction request is pending admin approval.
          </div>
        )}

        {record.approvedCorrectionType && !pendingRequest && (
          <div className="mt-5 rounded-xl border border-accent-green/30 bg-accent-green/5 p-4 text-sm text-accent-green">
            Admin approved your correction request for this date.
          </div>
        )}

        <div className="mt-6 space-y-4">
          <Select
            label="Request For"
            value={requestType}
            disabled={isLocked || submitting}
            onChange={(e) => setRequestType(e.target.value)}
            options={ATTENDANCE_CORRECTION_TYPES.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            placeholder="Select request type"
          />

          <div>
            <label className="block text-sm font-medium text-brand-black">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isLocked || submitting}
              rows={4}
              placeholder="Enter your comments here..."
              className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 disabled:bg-gray-50"
            />
          </div>

          {!isLocked && (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="w-full rounded-lg bg-brand-black py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>
      </main>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-surface-muted p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-brand-black">{value}</p>
    </div>
  );
}
