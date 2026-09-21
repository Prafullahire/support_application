'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { attendanceCorrectionsApi, AttendanceCorrectionRequest } from '@/lib/api';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { formatDate, formatTime } from '@/lib/utils';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

export default function AttendanceCorrectionsPage() {
  const [items, setItems] = useState<AttendanceCorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await attendanceCorrectionsApi.listAll(
        filter === 'PENDING' ? 'PENDING' : undefined,
      );
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load correction requests';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [filter]);

  const openReview = (id: string, action: 'approve' | 'reject') => {
    setReviewId(id);
    setReviewAction(action);
    setAdminNotes('');
  };

  const closeReview = () => {
    setReviewId(null);
    setReviewAction(null);
    setAdminNotes('');
  };

  const handleReview = async () => {
    if (!reviewId || !reviewAction) return;
    setSubmitting(true);
    try {
      if (reviewAction === 'approve') {
        await attendanceCorrectionsApi.approve(reviewId, adminNotes.trim() || undefined);
        toast.success('Request approved');
      } else {
        await attendanceCorrectionsApi.reject(reviewId, adminNotes.trim() || undefined);
        toast.success('Request rejected');
      }
      closeReview();
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const pagination = usePagination(items, { resetDeps: [filter] });

  return (
    <>
      <PageHeader
        title="Attendance Corrections"
        subtitle="Review and approve office boy attendance correction requests"
      />

      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === 'PENDING' ? 'primary' : 'outline'}
          onClick={() => setFilter('PENDING')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'ALL' ? 'primary' : 'outline'}
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>
      </div>

      {error && <ErrorBanner error={error} onDismiss={() => setError('')} />}

      {loading ? (
        <LoadingState message="Loading correction requests..." />
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
          No correction requests found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Sign In</th>
                <th className="px-4 py-3 font-medium">Sign Out</th>
                <th className="px-4 py-3 font-medium">Request For</th>
                <th className="px-4 py-3 font-medium">Comments</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedItems.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{item.staffName}</p>
                    <p className="text-xs text-neutral-500">{item.staffEmployeeId || item.staffPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    {item.attendance?.attendanceDate
                      ? formatDate(item.attendance.attendanceDate)
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {item.attendance?.loginTime ? formatTime(item.attendance.loginTime) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {item.attendance?.logoutTime ? formatTime(item.attendance.logoutTime) : '—'}
                  </td>
                  <td className="px-4 py-3">{item.requestTypeLabel}</td>
                  <td className="max-w-[220px] px-4 py-3 text-neutral-600">{item.comments}</td>
                  <td className="px-4 py-3">
                    <Badge
                      status={
                        item.status === 'APPROVED'
                          ? 'COMPLETED'
                          : item.status === 'REJECTED'
                            ? 'REJECTED'
                            : 'UNDER_REVIEW'
                      }
                      label={item.status}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {item.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => openReview(item.id, 'approve')}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReview(item.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400">
                        {item.adminNotes || 'Reviewed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
          />
        </div>
      )}

      <Modal
        open={Boolean(reviewId && reviewAction)}
        onClose={closeReview}
        title={reviewAction === 'approve' ? 'Approve request' : 'Reject request'}
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-neutral-700">
            Admin notes (optional)
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            placeholder="Add a note for the office boy..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeReview} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleReview} disabled={submitting}>
              {submitting ? 'Saving...' : reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
