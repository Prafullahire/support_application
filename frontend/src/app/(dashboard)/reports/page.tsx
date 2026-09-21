'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import { reportsApi, entitiesApi, branchesApi, ExpenseSummary, Entity, Branch } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { usePageActions } from '@/hooks/use-page-actions';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const exportModules = [
  { value: 'requests', label: 'Requests' },
  { value: 'assets', label: 'Assets' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'courier', label: 'Courier' },
  { value: 'amc', label: 'AMC' },
  { value: 'vendors', label: 'Vendors' },
];

export default function ReportsPage() {
  const { withGlobalLoader } = usePageActions();
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportModule, setExportModule] = useState('expenses');
  const [filters, setFilters] = useState({
    entityId: '',
    branchId: '',
    startDate: '',
    endDate: '',
  });

  const loadReports = () => {
    setLoading(true);
    const params = {
      entityId: filters.entityId || undefined,
      branchId: filters.branchId || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    };
    Promise.all([
      reportsApi.dashboard(params),
      reportsApi.expenseSummary(params),
      entitiesApi.list(),
      branchesApi.list(),
    ])
      .then(([dashboard, summary, ents, brs]) => {
        setReportData(dashboard as Record<string, unknown>);
        setExpenseSummary(summary);
        setEntities(ents);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load reports';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, [filters.entityId, filters.branchId, filters.startDate, filters.endDate]);

  const handleExport = async () => {
    const token = localStorage.getItem('accessToken');
    const params: Record<string, string> = { module: exportModule };
    if (filters.entityId) params.entityId = filters.entityId;
    if (filters.branchId) params.branchId = filters.branchId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const url = reportsApi.export(exportModule, params);
    const result = await withGlobalLoader(async () => {
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${exportModule}-report.xlsx`;
      link.click();
      toast.success('Export completed successfully');
      return true;
    }, 'Exporting report...');
    if (result === null) {
      setError('Export failed');
    }
  };

  const entityPagination = usePagination(expenseSummary?.entityWise ?? []);

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader title="Reports" subtitle="Entity-wise and branch-wise analytics" />

        <Card title="Report Filters">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Entity"
              value={filters.entityId}
              onChange={(e) => setFilters({ ...filters, entityId: e.target.value })}
              options={entities.map((e) => ({ value: e.id, label: e.name }))}
            />
            <Select
              label="Branch"
              value={filters.branchId}
              onChange={(e) => setFilters({ ...filters, branchId: e.target.value })}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
            <Input
              label="From Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              label="To Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </Card>

        <Card title="Export Data">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-64">
              <Select
                label="Module"
                value={exportModule}
                onChange={(e) => setExportModule(e.target.value)}
                options={exportModules}
              />
            </div>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" /> Export Excel
            </Button>
          </div>
        </Card>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : (
          <>
            {/* Expense Summary */}
            {expenseSummary && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <p className="text-sm text-neutral-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-black">
                      {formatCurrency(expenseSummary.grandTotal)}
                    </p>
                    <p className="text-xs text-neutral-400">{expenseSummary.totalCount} records</p>
                  </Card>
                  {expenseSummary.entityWise.map((entity) => (
                    <Card key={entity.entityId}>
                      <p className="text-sm text-neutral-500 truncate">{entity.entityName}</p>
                      <p className="text-2xl font-bold text-primary-600">{formatCurrency(entity.total)}</p>
                      <p className="text-xs text-neutral-400">{entity.count} expenses</p>
                    </Card>
                  ))}
                </div>

                <Card title="Entity-wise Expense Breakdown">
                  {expenseSummary.entityWise.length === 0 ? (
                    <p className="text-neutral-500">No expense data for selected filters</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200 text-left text-neutral-500">
                            <th className="pb-3 pr-4 font-medium">Entity</th>
                            <th className="pb-3 pr-4 font-medium">Total</th>
                            <th className="pb-3 pr-4 font-medium">Count</th>
                            <th className="pb-3 font-medium">Branch Breakdown</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entityPagination.paginatedItems.map((entity) => (
                            <tr key={entity.entityId} className="border-b border-neutral-100">
                              <td className="py-3 pr-4 font-medium">{entity.entityName}</td>
                              <td className="py-3 pr-4">{formatCurrency(entity.total)}</td>
                              <td className="py-3 pr-4">{entity.count}</td>
                              <td className="py-3">
                                {entity.branches?.length
                                  ? entity.branches.map((b) => (
                                      <span key={b.branchId} className="mr-3 inline-block text-neutral-600">
                                        {b.branchName}: {formatCurrency(b.total)}
                                      </span>
                                    ))
                                  : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <Pagination
                        page={entityPagination.page}
                        totalPages={entityPagination.totalPages}
                        totalItems={entityPagination.totalItems}
                        pageSize={entityPagination.pageSize}
                        startIndex={entityPagination.startIndex}
                        endIndex={entityPagination.endIndex}
                        onPageChange={entityPagination.setPage}
                        onPageSizeChange={entityPagination.setPageSize}
                      />
                    </div>
                  )}
                </Card>

                <Card title="Branch-wise Expense Summary">
                  {expenseSummary.branchWise.length === 0 ? (
                    <p className="text-neutral-500">No branch data for selected filters</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {expenseSummary.branchWise.map((branch) => (
                        <div key={branch.branchId} className="rounded-lg border border-neutral-200 p-4">
                          <p className="font-medium text-black">{branch.branchName}</p>
                          <p className="text-lg font-bold text-primary-600">{formatCurrency(branch.total)}</p>
                          <p className="text-xs text-neutral-400">{branch.count} expenses</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}

            {/* General Dashboard Stats */}
            {reportData && (
              <Card title="Overall Summary">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(reportData)
                    .filter(([key]) => key !== 'expenseSummary')
                    .map(([key, value]) => (
                      <div key={key} className="rounded-lg border border-neutral-200 p-4">
                        <p className="text-sm text-neutral-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-xl font-bold text-black">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}
                        </p>
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminGuard>
  );
}
