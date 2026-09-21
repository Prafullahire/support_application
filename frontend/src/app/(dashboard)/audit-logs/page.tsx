'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/auth-guard';
import { auditLogsApi, AuditLog } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { RowActions } from '@/components/ui/row-actions';
import { DetailField, DetailView } from '@/components/ui/detail-view';
import { useRecordModal } from '@/hooks/use-record-modal';
import { formatDate } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

export default function AuditLogsPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const modal = useRecordModal<AuditLog>();

  useEffect(() => {
    auditLogsApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load audit logs';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const pagination = usePagination(items);

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="System activity and change history" />

        <Card title="Activity Log">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          ) : items.length === 0 ? (
            <p className="text-center text-neutral-500">No audit logs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Action</th>
                    <th className="pb-3 pr-4 font-medium">Module</th>
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Details</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4"><Badge status={item.action} /></td>
                      <td className="py-3 pr-4 font-medium text-black">{item.module}</td>
                      <td className="py-3 pr-4 text-neutral-600">
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : '-'}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600 max-w-[200px] truncate">
                        {item.details || '-'}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">{formatDate(item.createdAt)}</td>
                      <td className="py-3">
                        <RowActions
                          onView={() => modal.openView(item)}
                          showEdit={false}
                          showDelete={false}
                        />
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
        </Card>

        <Modal
          open={modal.isView}
          onClose={modal.close}
          title="View Audit Log"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={modal.close}>Close</Button>
            </div>
          }
        >
          {modal.selected && (
            <DetailView>
              <DetailField label="Action" value={<Badge status={modal.selected.action} />} />
              <DetailField label="Module" value={modal.selected.module} />
              <DetailField label="Record ID" value={modal.selected.recordId} />
              <DetailField
                label="User"
                value={
                  modal.selected.user
                    ? `${modal.selected.user.firstName} ${modal.selected.user.lastName}`
                    : '-'
                }
              />
              <DetailField label="Details" value={modal.selected.details} />
              <DetailField label="Date" value={formatDate(modal.selected.createdAt)} />
            </DetailView>
          )}
        </Modal>
      </div>
    </AdminGuard>
  );
}
