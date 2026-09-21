'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/office-boy/portal/page-header';
import { AttendancePresenceBadge } from '@/components/office-boy/portal/attendance-presence-badge';
import { AttendanceStatusBadge } from '@/components/office-boy/portal/attendance-status-badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { attendanceCorrectionsApi, AttendanceCorrectionRequest } from '@/lib/api';
import { formatPortalTableDate } from '@/lib/portal';
import { formatTime } from '@/lib/utils';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

function getAdminStatusLabel(item: AttendanceCorrectionRequest) {
  if (item.status === 'APPROVED') {
    return item.requestTypeLabel;
  }
  if (item.status === 'REJECTED') {
    return 'Rejected';
  }
  return 'Pending Approval';
}

function getAdminStatusKey(item: AttendanceCorrectionRequest) {
  if (item.status === 'APPROVED') return 'FULL_DAY';
  if (item.status === 'REJECTED') return 'REJECTED';
  return 'INCOMPLETE';
}

export default function ApprovalPage() {
  const [items, setItems] = useState<AttendanceCorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await attendanceCorrectionsApi.myRequests();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load approval requests');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Daily"
        title="Attendance Approval"
        subtitle="Track your raised attendance correction requests"
        backHref="/office-boy/dashboard"
      />

      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
        {error && (
          <div className="mb-4">
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          </div>
        )}

        {loading ? (
          <LoadingState height="h-40" message="Loading requests..." />
        ) : items.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-brand-black">No requests raised yet</p>
            <p className="mt-2 text-xs text-text-muted">
              Open Daily Checklist, tap the eye icon, and submit a correction request.
            </p>
          </div>
        ) : (
          <ApprovalRequestsTable items={items} />
        )}
      </main>
    </>
  );
}

function ApprovalRequestsTable({ items }: { items: AttendanceCorrectionRequest[] }) {
  const pagination = usePagination(items);
  const thClass =
    'border-b border-gray-100 pb-2 font-medium max-md:px-2.5 max-md:whitespace-nowrap max-md:text-[10px] max-md:leading-tight';
  const tdClass = 'border-b border-gray-50 py-2.5 max-md:px-2.5 max-md:align-top';

  return (
    <div className="-mx-1 overflow-x-auto scrollbar-thin max-md:px-1 md:mx-0 md:px-0">
      <table className="w-full border-collapse text-sm md:min-w-[640px] max-md:min-w-[700px] max-md:table-fixed">
        <colgroup className="md:hidden">
          <col style={{ width: '78px' }} />
          <col style={{ width: '84px' }} />
          <col style={{ width: '62px' }} />
          <col style={{ width: '62px' }} />
          <col style={{ width: '128px' }} />
          <col style={{ width: '140px' }} />
        </colgroup>
        <thead>
          <tr className="text-left text-xs text-text-muted">
            <th className={thClass}>Date</th>
            <th className={thClass}>Attendance</th>
            <th className={thClass}>Sign In</th>
            <th className={thClass}>Sign Out</th>
            <th className={thClass}>Admin Status</th>
            <th className={thClass}>Comments</th>
          </tr>
        </thead>
        <tbody>
          {pagination.paginatedItems.map((item) => {
            const attendance = item.attendance;
            const present = Boolean(attendance?.loginTime);

            return (
              <tr key={item.id} className="text-gray-700">
                <td className={`${tdClass} max-md:whitespace-nowrap max-md:text-[11px]`}>
                  {attendance?.attendanceDate
                    ? formatPortalTableDate(attendance.attendanceDate)
                    : '—'}
                </td>
                <td className={tdClass}>
                  <AttendancePresenceBadge present={present} />
                </td>
                <td className={`${tdClass} max-md:whitespace-nowrap max-md:text-[11px]`}>
                  {attendance?.loginTime ? formatTime(attendance.loginTime) : '—'}
                </td>
                <td className={`${tdClass} max-md:whitespace-nowrap max-md:text-[11px]`}>
                  {attendance?.logoutTime ? formatTime(attendance.logoutTime) : '—'}
                </td>
                <td className={`${tdClass} max-md:whitespace-normal`}>
                  <div className="space-y-1">
                    <AttendanceStatusBadge
                      label={getAdminStatusLabel(item)}
                      status={getAdminStatusKey(item)}
                      size="sm"
                    />
                    {item.status === 'PENDING' && (
                      <p className="text-[10px] leading-snug text-text-muted">
                        Requested: {item.requestTypeLabel}
                      </p>
                    )}
                    {item.status === 'REJECTED' && item.adminNotes && (
                      <p className="text-[10px] leading-snug text-text-muted">
                        Admin: {item.adminNotes}
                      </p>
                    )}
                  </div>
                </td>
                <td className={`${tdClass} max-md:whitespace-normal max-md:text-[11px] leading-relaxed text-gray-600`}>
                  {item.comments}
                </td>
              </tr>
            );
          })}
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
  );
}
