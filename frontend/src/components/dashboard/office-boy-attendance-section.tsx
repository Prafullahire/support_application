'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
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
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatAttendanceStatus,
  getUserDisplayPhone,
} from '@/lib/utils';
import { downloadCsv } from '@/lib/export';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Download,
  ExternalLink,
  Filter,
  Users,
} from 'lucide-react';

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

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'FULL_DAY', label: 'Full Day' },
  { value: 'HALF_DAY', label: 'Half Day' },
  { value: 'EARLY_LEAVE', label: 'Early Leave' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
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
  const parts: string[] = [];
  if (filters.period) {
    parts.push(PERIOD_OPTIONS.find((p) => p.value === filters.period)?.label || 'Filtered');
  } else if (filters.startDate && filters.endDate) {
    parts.push(`${formatDate(filters.startDate)} – ${formatDate(filters.endDate)}`);
  } else {
    parts.push('All dates');
  }
  if (filters.status) {
    parts.push(STATUS_OPTIONS.find((s) => s.value === filters.status)?.label || filters.status);
  }
  return parts.join(' · ');
}

export function OfficeBoyAttendanceSection() {
  const [items, setItems] = useState<AttendanceRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [staff, setStaff] = useState<OfficeBoyStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const fetchAttendance = useCallback(async (activeFilters: typeof EMPTY_FILTERS) => {
    setLoading(true);
    try {
      const data = await attendanceApi.listAll(buildParams(activeFilters));
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([branchesApi.list(), officeLocationsApi.list(), officeBoyStaffApi.list()])
      .then(([brs, locs, st]) => {
        setBranches(brs);
        setLocations(locs);
        setStaff(st);
      })
      .catch(() => {});
    fetchAttendance(EMPTY_FILTERS);
  }, [fetchAttendance]);

  const applyFilters = (next: typeof EMPTY_FILTERS) => {
    setFilters(next);
    setAppliedFilters(next);
    fetchAttendance(next);
  };

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
    applyFilters(filters);
  };

  const handleClearFilters = () => {
    setShowDateRange(false);
    applyFilters(EMPTY_FILTERS);
  };

  const handleQuickPeriod = (period: string) => {
    applyFilters({ ...appliedFilters, period, startDate: '', endDate: '' });
    setShowDateRange(false);
  };

  const handleStatusFilter = (status: string) => {
    applyFilters({ ...appliedFilters, status });
  };

  const handleExport = () => {
    if (!items.length) {
      toast.error('No records to export');
      return;
    }
    const headers = [
      'Date', 'Staff', 'Employee ID', 'Phone', 'Branch', 'Location',
      'Login', 'Logout', 'Hours', 'Status',
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
        row.loginTime ? formatDateTime(row.loginTime) : '',
        row.logoutTime ? formatDateTime(row.logoutTime) : '',
        row.workingDurationFormatted || '',
        formatAttendanceStatus(row.status, row.statusLabel),
      ];
    });
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`office-boy-attendance-${today}.csv`, headers, rows);
    toast.success(`Exported ${items.length} records`);
  };

  const filteredLocations = locations.filter(
    (l) => !filters.branchId || l.branchId === filters.branchId,
  );

  const fullDayCount = items.filter((r) => r.status === 'FULL_DAY' || r.status === 'PRESENT').length;
  const halfDayCount = items.filter((r) => r.status === 'HALF_DAY').length;
  const earlyLeaveCount = items.filter((r) => r.status === 'EARLY_LEAVE').length;
  const incompleteCount = items.filter((r) => r.status === 'INCOMPLETE').length;
  const totalHours = items.reduce((sum, r) => sum + (r.workingDurationMinutes || 0), 0);

  const usingCustomRange =
    !appliedFilters.period && appliedFilters.startDate && appliedFilters.endDate;

  const hasExtraFilters =
    !!appliedFilters.branchId ||
    !!appliedFilters.locationId ||
    !!appliedFilters.userId ||
    usingCustomRange;

  const pagination = usePagination(items, { resetDeps: [appliedFilters] });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Office Boy Attendance</h2>
            <p className="text-sm text-neutral-500">{getFilterSummary(appliedFilters)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleExport} disabled={!items.length}>
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
          <Link href="/office-boy-attendance">
            <Button type="button" variant="outline" size="sm">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Full View
            </Button>
          </Link>
        </div>
      </div>

      {/* Clickable count cards — filter by status */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <CountCard
          label="Total"
          value={items.length}
          className="bg-black text-white"
          active={!appliedFilters.status}
          onClick={() => handleStatusFilter('')}
        />
        <CountCard
          label="Full Day"
          value={fullDayCount}
          className="bg-green-600 text-white"
          active={appliedFilters.status === 'FULL_DAY'}
          onClick={() => handleStatusFilter('FULL_DAY')}
        />
        <CountCard
          label="Half Day"
          value={halfDayCount}
          className="bg-amber-500 text-white"
          active={appliedFilters.status === 'HALF_DAY'}
          onClick={() => handleStatusFilter('HALF_DAY')}
        />
        <CountCard
          label="Early Leave"
          value={earlyLeaveCount}
          className="bg-orange-500 text-white"
          active={appliedFilters.status === 'EARLY_LEAVE'}
          onClick={() => handleStatusFilter('EARLY_LEAVE')}
        />
        <CountCard
          label="Incomplete"
          value={incompleteCount}
          className="bg-neutral-500 text-white"
          active={appliedFilters.status === 'INCOMPLETE'}
          onClick={() => handleStatusFilter('INCOMPLETE')}
        />
        <CountCard
          label="Total Hours"
          value={totalHours > 0 ? `${Math.floor(totalHours / 60)}h` : '0h'}
          className="bg-primary-600 text-white"
          active={false}
        />
      </div>

      {/* Filters — collapsible */}
      <Card className="border border-neutral-200 p-4">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary-600" />
            <p className="text-sm font-semibold text-black">Filters</p>
            {!filtersOpen && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                {getFilterSummary(appliedFilters)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <span className="hidden text-xs sm:inline">
              {filtersOpen ? 'Hide' : 'Show'}
            </span>
            {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        {!filtersOpen && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              Showing <strong className="text-black">{items.length}</strong> record
              {items.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {filtersOpen && (
          <div className="mt-4 border-t border-neutral-100 pt-4">
        {/* Period */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Date</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleQuickPeriod(opt.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
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
            onClick={() => {
              setShowDateRange(true);
              setFilters((prev) => ({ ...prev, period: '' }));
            }}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium ${
              usingCustomRange || showDateRange
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Custom Range
          </button>
        </div>

        {/* Status — matches count cards */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Status</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => handleStatusFilter(opt.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                appliedFilters.status === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* More filters — branch, location, staff, custom dates */}
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">More Filters</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Branch"
            value={filters.branchId}
            onChange={(e) => setFilters({ ...filters, branchId: e.target.value, locationId: '' })}
            options={[{ value: '', label: 'All branches' }, ...branches.map((b) => ({ value: b.id, label: b.name }))]}
          />
          <Select
            label="Office Location"
            value={filters.locationId}
            onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
            options={[{ value: '', label: 'All locations' }, ...filteredLocations.map((l) => ({ value: l.id, label: l.name }))]}
          />
          <Select
            label="Staff"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            options={[
              { value: '', label: 'All staff' },
              ...staff.map((s) => ({ value: s.id, label: `${s.firstName} ${s.lastName} (${s.employeeId})` })),
            ]}
          />
          <Select
            label="Period"
            value={filters.period}
            onChange={(e) =>
              setFilters({ ...filters, period: e.target.value, startDate: '', endDate: '' })
            }
            options={[
              { value: '', label: 'Custom / All dates' },
              ...PERIOD_OPTIONS.map((p) => ({ value: p.value, label: p.label })),
            ]}
          />
        </div>

        {(showDateRange || usingCustomRange) && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              disabled={!!filters.period}
              max={filters.endDate || undefined}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value, period: '' })}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              disabled={!!filters.period}
              min={filters.startDate || undefined}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value, period: '' })}
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleApplyFilters}>Apply Filters</Button>
          <Button size="sm" variant="outline" onClick={handleClearFilters}>Clear All</Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            Showing <strong className="text-black">{items.length}</strong> record{items.length !== 1 ? 's' : ''}
          </span>
          {hasExtraFilters && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              Branch / Staff / Date filters active — click Apply if changed
            </span>
          )}
        </div>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border border-neutral-200">
        {loading ? (
          <p className="p-6 text-center text-sm text-neutral-500">Loading attendance...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Login</th>
                  <th className="px-4 py-3">Logout</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((row) => (
                  <tr key={row.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="px-4 py-3 font-medium">{row.attendanceDate ? formatDate(row.attendanceDate) : '—'}</td>
                    <td className="px-4 py-3">
                      <p>{row.staffName || '—'}</p>
                      <p className="text-xs text-neutral-500">{row.staffEmployeeId || ''}</p>
                    </td>
                    <td className="px-4 py-3">{row.branch?.name || '—'}</td>
                    <td className="px-4 py-3">{formatTime(row.loginTime)}</td>
                    <td className="px-4 py-3">{formatTime(row.logoutTime)}</td>
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
            {!items.length && (
              <p className="p-8 text-center text-sm text-neutral-500">
                No attendance records found. Try changing filters.
              </p>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

function CountCard({
  label,
  value,
  className,
  active,
  onClick,
}: {
  label: string;
  value: string | number;
  className: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const clickable = !!onClick;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`rounded-xl px-3 py-3 text-center shadow-sm transition-all ${className} ${
        clickable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : 'cursor-default'
      } ${active ? 'ring-4 ring-white ring-offset-2 ring-offset-neutral-100' : ''}`}
    >
      <p className="text-xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-90">{label}</p>
    </button>
  );
}
