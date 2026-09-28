'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useCallback, useEffect, useState } from 'react';
import { AdminGuard } from '@/components/auth-guard';
import {
  attendanceApi,
  officeBoyStaffApi,
  officeLocationsApi,
  branchesApi,
  AttendanceRecord,
  OfficeBoyStaff,
  OfficeLocation,
  Branch,
} from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime, formatTime, formatAttendanceStatus, getUserDisplayPhone } from '@/lib/utils';
import { downloadCsv } from '@/lib/export';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';
import { CalendarDays, Download, Filter, Users, X } from 'lucide-react';

const EMPTY_FILTERS = {
  branchId: '',
  locationId: '',
  userId: '',
  status: '',
  period: '',
  startDate: '',
  endDate: '',
};

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
] as const;

function buildParams(filters: typeof EMPTY_FILTERS) {
  const params: Record<string, string> = {};
  if (filters.branchId) params.branchId = filters.branchId;
  if (filters.locationId) params.locationId = filters.locationId;
  if (filters.userId) params.userId = filters.userId;
  if (filters.status) params.status = filters.status;

  if (filters.period) {
    params.period = filters.period;
  } else if (filters.startDate && filters.endDate) {
    params.startDate = filters.startDate;
    params.endDate = filters.endDate;
  }

  return params;
}

function getFilterSummary(filters: typeof EMPTY_FILTERS) {
  if (filters.period) {
    return PERIOD_OPTIONS.find((p) => p.value === filters.period)?.label || 'Filtered';
  }
  if (filters.startDate && filters.endDate) {
    return `${formatDate(filters.startDate)} – ${formatDate(filters.endDate)}`;
  }
  return 'All dates';
}

export default function OfficeBoyAttendancePage() {
  const [items, setItems] = useState<AttendanceRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [staff, setStaff] = useState<OfficeBoyStaff[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const loadMeta = () => {
    Promise.all([branchesApi.list(), officeLocationsApi.list(), officeBoyStaffApi.list()])
      .then(([brs, locs, st]) => {
        setBranches(brs);
        setLocations(locs);
        setStaff(st);
      })
      .catch(() => {});
  };

  const fetchAttendance = useCallback(async (activeFilters: typeof EMPTY_FILTERS, isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    else setTableLoading(true);

    try {
      const data = await attendanceApi.listAll(buildParams(activeFilters));
      setItems(data);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load attendance';
      setError(message);
      toast.error(message);
    } finally {
      if (isInitial) setInitialLoading(false);
      else setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeta();
    fetchAttendance(EMPTY_FILTERS, true);
  }, [fetchAttendance]);

  const handleApplyFilters = () => {
    if (!filters.period && (filters.startDate || filters.endDate)) {
      if (!filters.startDate || !filters.endDate) {
        toast.error('Please select both start date and end date');
        return;
      }
      if (filters.startDate > filters.endDate) {
        toast.error('Start date cannot be after end date');
        return;
      }
    }
    setAppliedFilters(filters);
    fetchAttendance(filters);
    setShowDateFilters(false);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    fetchAttendance(EMPTY_FILTERS);
  };

  const handleExport = () => {
    if (!items.length) {
      toast.error('No records to export. Apply filters or check if data exists.');
      return;
    }

    const headers = [
      'Date',
      'Staff Name',
      'Employee ID',
      'Phone',
      'Branch',
      'Office Location',
      'Login Time',
      'Login DateTime',
      'Logout Time',
      'Logout DateTime',
      'Working Hours',
      'Working Minutes',
      'Status',
    ];

    const rows = items.map((row) => {
      const phone = getUserDisplayPhone({ phone: row.staffPhone });
      return [
        formatDate(row.attendanceDate),
        row.staffName || '',
        row.staffEmployeeId || '',
        phone === '—' ? '' : phone,
        row.branch?.name || '',
        row.location?.name || '',
        formatTime(row.loginTime),
        row.loginTime ? formatDateTime(row.loginTime) : '',
        formatTime(row.logoutTime),
        row.logoutTime ? formatDateTime(row.logoutTime) : '',
        row.workingDurationFormatted || '',
        row.workingDurationMinutes ?? '',
        formatAttendanceStatus(row.status, row.statusLabel),
      ];
    });

    const rangeLabel = getFilterSummary(appliedFilters).replace(/\s+/g, '-').toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`office-boy-attendance-${rangeLabel}-${today}.csv`, headers, rows);
    toast.success(`Exported ${items.length} record${items.length !== 1 ? 's' : ''} to CSV`);
  };

  const handleQuickPeriod = (period: string) => {
    const next = { ...filters, period, startDate: '', endDate: '' };
    setFilters(next);
    setAppliedFilters(next);
    fetchAttendance(next);
  };

  const handleCustomRangeApply = () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Please select both start date and end date');
      return;
    }
    if (filters.startDate > filters.endDate) {
      toast.error('Start date cannot be after end date');
      return;
    }
    const next = { ...filters, period: '' };
    setFilters(next);
    setAppliedFilters(next);
    fetchAttendance(next);
    setShowDateFilters(false);
  };

  const filteredLocations = locations.filter(
    (l) => !filters.branchId || l.branchId === filters.branchId,
  );

  const usingCustomRange =
    !appliedFilters.period && appliedFilters.startDate && appliedFilters.endDate;

  const pagination = usePagination(items, { resetDeps: [appliedFilters] });

  if (initialLoading) return <LoadingState message="Loading attendance..." />;

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader
          title="Office Boy Attendance"
          subtitle="View date-wise login, logout and working hours for all office boy staff"
        />
        <ErrorBanner error={error} onDismiss={() => setError('')} />

        {/* Filters */}
        <Card className="border border-neutral-200 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary-600" />
              <h3 className="font-semibold text-black">Filters</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleQuickPeriod(opt.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    appliedFilters.period === opt.value
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowDateFilters((v) => !v)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  usingCustomRange
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Custom Range
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Branch"
              value={filters.branchId}
              onChange={(e) => setFilters({ ...filters, branchId: e.target.value, locationId: '' })}
              options={[
                { value: '', label: 'All branches' },
                ...branches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
            <Select
              label="Office Location"
              value={filters.locationId}
              onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
              options={[
                { value: '', label: 'All locations' },
                ...filteredLocations.map((l) => ({ value: l.id, label: l.name })),
              ]}
            />
            <Select
              label="Staff"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              options={[
                { value: '', label: 'All staff' },
                ...staff.map((s) => ({
                  value: s.id,
                  label: `${s.firstName} ${s.lastName} (${s.employeeId})`,
                })),
              ]}
            />
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All statuses' },
                { value: 'FULL_DAY', label: 'Full Day' },
                { value: 'HALF_DAY', label: 'Half Day' },
                { value: 'EARLY_LEAVE', label: 'Early Leave' },
                { value: 'INCOMPLETE', label: 'Incomplete' },
                { value: 'ABSENT', label: 'Absent' },
              ]}
            />
          </div>

          {showDateFilters && (
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-black">Filter by date range</p>
                <button
                  type="button"
                  onClick={() => setShowDateFilters(false)}
                  className="rounded-md p-1 text-neutral-400 hover:bg-white hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={filters.startDate}
                  disabled={!!filters.period}
                  max={filters.endDate || undefined}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      startDate: e.target.value,
                      period: '',
                    })
                  }
                />
                <Input
                  label="End Date"
                  type="date"
                  value={filters.endDate}
                  disabled={!!filters.period}
                  min={filters.startDate || undefined}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      endDate: e.target.value,
                      period: '',
                    })
                  }
                />
                <div className="flex items-end">
                  <Button className="w-full" onClick={handleCustomRangeApply}>
                    Apply Date Range
                  </Button>
                </div>
              </div>
              {filters.startDate && filters.endDate && (
                <p className="mt-3 text-sm text-neutral-600">
                  Will show records from{' '}
                  <strong>
                    {formatDate(filters.startDate)} to {formatDate(filters.endDate)}
                  </strong>
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button type="button" variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        </Card>

        {/* Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white">
              <Users className="h-4 w-4" />
              <span>
                <strong>{items.length}</strong> record{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
              Date range: <strong className="text-black">{getFilterSummary(appliedFilters)}</strong>
            </div>
            {usingCustomRange && (
              <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-primary-800">
                Showing {formatDate(appliedFilters.startDate)} – {formatDate(appliedFilters.endDate)}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={!items.length || tableLoading}
            className="shrink-0"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden border border-neutral-200">
          {tableLoading && (
            <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-neutral-500">
              Loading records...
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Login Time</th>
                  <th className="px-4 py-3">Logout Time</th>
                  <th className="px-4 py-3">Working Hours</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((row) => (
                  <tr key={row.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="px-4 py-3 font-medium text-black">
                      {row.attendanceDate ? formatDate(row.attendanceDate) : '—'}
                    </td>
                    <td className="px-4 py-3">{row.staffName || '—'}</td>
                    <td className="px-4 py-3">{row.staffEmployeeId || '—'}</td>
                    <td className="px-4 py-3">
                      {getUserDisplayPhone({ phone: row.staffPhone })}
                    </td>
                    <td className="px-4 py-3">{row.branch?.name || '—'}</td>
                    <td className="px-4 py-3">{row.location?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-black">{formatTime(row.loginTime)}</div>
                      <div className="text-xs text-neutral-500">{formatDateTime(row.loginTime)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-black">{formatTime(row.logoutTime)}</div>
                      <div className="text-xs text-neutral-500">{formatDateTime(row.logoutTime)}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary-700">
                      {row.workingDurationFormatted || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={row.status} label={row.statusLabel} />
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
            {!items.length && !tableLoading && (
              <p className="p-8 text-center text-sm text-neutral-500">
                No attendance records found for the selected filters.
              </p>
            )}
          </div>
        </Card>
      </div>
    </AdminGuard>
  );
}
