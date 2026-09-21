'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/components/office-boy/portal/page-header';
import { AttendanceRecordsView } from '@/components/office-boy/portal/attendance-records-view';
import { useOfficeBoyAttendance } from '@/lib/hooks/use-office-boy-attendance';
import { formatTime } from '@/lib/utils';

export default function ChecklistPage() {
  const {
    historyMonth,
    setHistoryMonth,
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
    today,
  } = useOfficeBoyAttendance();

  useEffect(() => {
    void loadHistory(appliedHistoryFilters, historyMonth);
  }, [appliedHistoryFilters, historyMonth, loadHistory]);

  return (
    <>
      <PageHeader
        eyebrow="Daily"
        title="Daily Checklist"
        backHref="/office-boy/dashboard"
      />

      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
        {today?.loginTime && (
          <div className="mb-5 rounded-2xl border border-gray-100 bg-surface-muted p-4">
            <p className="text-xs font-medium text-text-muted">Today&apos;s attendance</p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-text-muted">Sign In</p>
                <p className="mt-0.5 font-semibold text-accent-green">
                  {formatTime(today.loginTime)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Sign Out</p>
                <p className="mt-0.5 font-semibold text-brand-red-bright">
                  {formatTime(today.logoutTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        <AttendanceRecordsView
          historyMonth={historyMonth}
          onHistoryMonthChange={setHistoryMonth}
          historyLoading={historyLoading}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
          onCloseFilters={() => setShowFilters(false)}
          historyFilters={historyFilters}
          onHistoryFiltersChange={setHistoryFilters}
          onApplyFilters={handleApplyHistoryFilters}
          onClearFilters={handleClearHistoryFilters}
          records={monthFilteredHistory}
          monthlySummary={monthlySummary}
          showViewAction
          emptyMessage="No attendance records for this period."
        />
      </main>
    </>
  );
}
