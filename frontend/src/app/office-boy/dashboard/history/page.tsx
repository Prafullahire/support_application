'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/components/office-boy/portal/page-header';
import { AttendanceRecordsView } from '@/components/office-boy/portal/attendance-records-view';
import { useOfficeBoyAttendance } from '@/lib/hooks/use-office-boy-attendance';

export default function OfficeBoyHistoryPage() {
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
  } = useOfficeBoyAttendance();

  useEffect(() => {
    void loadHistory(appliedHistoryFilters, historyMonth);
  }, [appliedHistoryFilters, historyMonth, loadHistory]);

  return (
    <>
      <PageHeader
        eyebrow="Daily"
        title="Attendance"
        backHref="/office-boy/dashboard"
      />

      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
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
          showSummary
          emptyMessage="No records for this month."
        />
      </main>
    </>
  );
}
