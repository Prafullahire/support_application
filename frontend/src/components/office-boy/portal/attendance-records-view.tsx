'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye, Filter, X } from 'lucide-react';
import { HourBadge } from '@/components/office-boy/portal/hour-badge';
import { AttendancePresenceBadge } from '@/components/office-boy/portal/attendance-presence-badge';
import { AttendanceStatusBadge } from '@/components/office-boy/portal/attendance-status-badge';
import { LoadingState } from '@/components/ui/loading-state';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AttendanceRecord } from '@/lib/api';
import { formatPortalTableDate } from '@/lib/portal';
import { formatTime } from '@/lib/utils';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
] as const;

export type AttendanceHistoryFilters = {
  period: string;
  startDate: string;
  endDate: string;
  status: string;
};

type MonthlySummary = {
  presentDays: number;
  absentDays: number;
  avgHours: string;
  month: string;
};

export function AttendanceRecordsView({
  historyMonth,
  onHistoryMonthChange,
  historyLoading,
  showFilters,
  onToggleFilters,
  onCloseFilters,
  historyFilters,
  onHistoryFiltersChange,
  onApplyFilters,
  onClearFilters,
  records,
  monthlySummary,
  showSummary = false,
  showViewAction = false,
  emptyMessage = 'No records for this period.',
}: {
  historyMonth: Date;
  onHistoryMonthChange: (date: Date) => void;
  historyLoading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCloseFilters: () => void;
  historyFilters: AttendanceHistoryFilters;
  onHistoryFiltersChange: (filters: AttendanceHistoryFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  records: AttendanceRecord[];
  monthlySummary: MonthlySummary;
  showSummary?: boolean;
  showViewAction?: boolean;
  emptyMessage?: string;
}) {
  const mobileTableMinWidth = showViewAction ? 'max-md:min-w-[720px]' : 'max-md:min-w-[640px]';
  const thClass =
    'border-b border-gray-100 pb-2 font-medium max-md:px-2.5 max-md:whitespace-nowrap max-md:text-[10px] max-md:leading-tight';
  const tdClass = 'border-b border-gray-50 py-2.5 max-md:px-2.5 max-md:align-top';

  const pagination = usePagination(records, { resetDeps: [historyFilters] });

  return (
    <>
      {showSummary && (
        <div className="mb-6 hidden grid-cols-3 gap-4 md:grid">
          <SummaryCard label="Present Days" value={String(monthlySummary.presentDays)} />
          <SummaryCard label="Absent Days" value={String(monthlySummary.absentDays)} />
          <SummaryCard label="Avg. Hours / Day" value={monthlySummary.avgHours} />
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            onHistoryMonthChange(new Date(historyMonth.getFullYear(), historyMonth.getMonth() - 1, 1))
          }
          aria-label="Previous month"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-surface-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="flex-1 text-center text-sm font-semibold text-brand-black">
          {monthlySummary.month}
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggleFilters}
            aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            aria-pressed={showFilters}
            className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
              showFilters
                ? 'bg-brand-red-bright/10 text-brand-red-bright'
                : 'text-gray-500 hover:bg-surface-muted hover:text-brand-red-bright'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              onHistoryMonthChange(new Date(historyMonth.getFullYear(), historyMonth.getMonth() + 1, 1))
            }
            aria-label="Next month"
            className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-surface-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 rounded-xl border border-gray-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-black">
              <Filter className="h-4 w-4 text-brand-red-bright" />
              Filter records
            </p>
            <button type="button" onClick={onCloseFilters} className="text-gray-400">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3">
            <Select
              label="Period"
              value={historyFilters.period}
              onChange={(e) =>
                onHistoryFiltersChange({
                  ...historyFilters,
                  period: e.target.value,
                  startDate: '',
                  endDate: '',
                })
              }
              options={[
                { value: '', label: 'Custom date range' },
                ...PERIOD_OPTIONS.map((p) => ({ value: p.value, label: p.label })),
              ]}
            />
            <Select
              label="Status"
              value={historyFilters.status}
              onChange={(e) =>
                onHistoryFiltersChange({ ...historyFilters, status: e.target.value })
              }
              options={[
                { value: '', label: 'All statuses' },
                { value: 'FULL_DAY', label: 'Full Day' },
                { value: 'HALF_DAY', label: 'Half Day' },
                { value: 'EARLY_LEAVE', label: 'Early Leave' },
                { value: 'INCOMPLETE', label: 'Incomplete' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start"
                type="date"
                value={historyFilters.startDate}
                disabled={!!historyFilters.period}
                onChange={(e) =>
                  onHistoryFiltersChange({
                    ...historyFilters,
                    startDate: e.target.value,
                    period: '',
                  })
                }
              />
              <Input
                label="End"
                type="date"
                value={historyFilters.endDate}
                disabled={!!historyFilters.period}
                onChange={(e) =>
                  onHistoryFiltersChange({
                    ...historyFilters,
                    endDate: e.target.value,
                    period: '',
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onApplyFilters}
                className="flex-1 rounded-lg bg-brand-black py-2.5 text-sm font-semibold text-white"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={onClearFilters}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-500"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="-mx-1 overflow-x-auto scrollbar-thin max-md:px-1 md:mx-0 md:px-0">
        <table
          className={`w-full border-collapse text-sm md:min-w-[560px] max-md:table-fixed ${mobileTableMinWidth}`}
        >
          <colgroup className="md:hidden">
            <col style={{ width: '78px' }} />
            <col style={{ width: '84px' }} />
            <col style={{ width: '62px' }} />
            <col style={{ width: '62px' }} />
            <col style={{ width: '72px' }} />
            <col style={{ width: showViewAction ? '108px' : '120px' }} />
            {showViewAction && <col style={{ width: '44px' }} />}
          </colgroup>
          <thead>
            <tr className="text-left text-xs text-text-muted">
              <th className={thClass}>Date</th>
              <th className={thClass}>Attendance</th>
              <th className={thClass}>Sign In</th>
              <th className={thClass}>Sign Out</th>
              <th className={thClass}>Total Hrs</th>
              <th className={thClass}>Status</th>
              {showViewAction && (
                <th className={`${thClass} text-center`} aria-label="View" />
              )}
            </tr>
          </thead>
          <tbody>
            {historyLoading ? (
              <tr>
                <td colSpan={showViewAction ? 7 : 6} className="py-8">
                  <LoadingState height="h-24" message="Loading records..." />
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={showViewAction ? 7 : 6} className="py-8 text-center text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pagination.paginatedItems.map((row) => (
                <tr key={row.id} className="text-gray-700">
                  <td className={`${tdClass} max-md:whitespace-nowrap max-md:text-[11px]`}>
                    {formatPortalTableDate(row.attendanceDate)}
                  </td>
                  <td className={tdClass}>
                    <AttendancePresenceBadge present={Boolean(row.loginTime)} />
                  </td>
                  <td className={`${tdClass} max-md:whitespace-nowrap max-md:text-[11px]`}>
                    {row.loginTime ? formatTime(row.loginTime) : '-'}
                  </td>
                  <td className={`${tdClass} max-md:whitespace-nowrap max-md:text-[11px]`}>
                    {row.logoutTime ? formatTime(row.logoutTime) : '-'}
                  </td>
                  <td className={`${tdClass} max-md:whitespace-nowrap`}>
                    {row.workingDurationFormatted ? (
                      <HourBadge value={row.workingDurationFormatted} size="sm" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={`${tdClass} max-md:whitespace-normal`}>
                    {row.statusLabel ? (
                      <div className="space-y-1">
                        <AttendanceStatusBadge
                          label={row.statusLabel}
                          status={row.status}
                          size="sm"
                        />
                        {row.lateReason && (
                          <p className="max-w-[140px] text-[10px] leading-snug text-text-muted">
                            Late: {row.lateReason}
                          </p>
                        )}
                        {row.earlyLeaveReason && (
                          <p className="max-w-[140px] text-[10px] leading-snug text-text-muted">
                            Early out: {row.earlyLeaveReason}
                          </p>
                        )}
                      </div>
                    ) : row.correctionRequest?.status === 'PENDING' ? (
                      <AttendanceStatusBadge
                        label="Pending Approval"
                        status="INCOMPLETE"
                        size="sm"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  {showViewAction && (
                    <td className={`${tdClass} text-center`}>
                      {row.loginTime ? (
                        <Link
                          href={`/office-boy/dashboard/checklist/${row.id}/more-info`}
                          aria-label="View more info"
                          className="inline-grid h-8 w-8 place-items-center rounded-full text-gray-500 transition-colors hover:bg-surface-muted hover:text-brand-red-bright"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
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
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-black">{value}</p>
    </div>
  );
}
