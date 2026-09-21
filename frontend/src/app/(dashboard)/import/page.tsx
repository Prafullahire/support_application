'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import { importsApi, branchesApi, Branch } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { usePageActions } from '@/hooks/use-page-actions';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

interface ImportJob {
  id: string;
  module: string;
  status: string;
  fileName?: string;
  createdAt: string;
  recordsProcessed?: number;
}

const importModules = [
  { value: 'users', label: 'Users' },
  { value: 'assets', label: 'Assets' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'requests', label: 'Requests' },
  { value: 'vendors', label: 'Vendors' },
];

export default function ImportPage() {
  const { withGlobalLoader } = usePageActions();
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [importModule, setImportModule] = useState('users');
  const [branchId, setBranchId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([importsApi.jobs(), branchesApi.list()])
      .then(([jobData, brs]) => {
        setJobs(jobData as ImportJob[]);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load import jobs';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setError('');
    const result = await withGlobalLoader(
      () => importsApi.upload(file, importModule, branchId || undefined),
      'Uploading and importing file...',
    );
    if (result !== null) {
      setFile(null);
      loadData();
      toast.success('File uploaded successfully');
    } else {
      setError('Upload failed');
    }
    setSubmitting(false);
  };

  const pagination = usePagination(jobs);

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader title="Data Import" subtitle="Import data from CSV files" />

        <Card title="Upload File">
          <form onSubmit={handleUpload} className="space-y-4">
            <ErrorBanner error={error} onDismiss={() => setError('')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Module"
                value={importModule}
                onChange={(e) => setImportModule(e.target.value)}
                options={importModules}
              />
              {branches.length > 0 && (
                <Select
                  label="Branch (optional)"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  options={branches.map((b) => ({ value: b.id, label: b.name }))}
                />
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800">CSV File</label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-600 hover:file:bg-primary-100"
                required
              />
            </div>
            <Button type="submit" loading={submitting} className="gap-2">
              <Upload className="h-4 w-4" /> Upload & Import
            </Button>
          </form>
        </Card>

        <Card title="Import Jobs">
          {loading ? (
            <LoadingState />
          ) : jobs.length === 0 ? (
            <p className="text-center text-neutral-500">No import jobs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Module</th>
                    <th className="pb-3 pr-4 font-medium">File</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Records</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((job) => (
                    <tr key={job.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4 font-medium text-black">{job.module}</td>
                      <td className="py-3 pr-4 text-neutral-600">{job.fileName || '-'}</td>
                      <td className="py-3 pr-4"><Badge status={job.status} /></td>
                      <td className="py-3 pr-4 text-neutral-600">{job.recordsProcessed ?? '-'}</td>
                      <td className="py-3 text-neutral-600">{formatDate(job.createdAt)}</td>
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
        </Card>
      </div>
    </AdminGuard>
  );
}
