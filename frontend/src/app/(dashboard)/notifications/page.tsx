'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useEffect, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { notificationsApi, Notification } from '@/lib/api';
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

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const modal = useRecordModal<Notification>();

  const loadData = () => {
    setLoading(true);
    notificationsApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load notifications';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      toast.success('Notification marked as read');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read';
      setError(message);
      toast.error(message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      toast.success('All notifications marked as read');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(message);
      toast.error(message);
    }
  };

  const pagination = usePagination(items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="View and manage your notifications"
        actions={
          <Button variant="secondary" onClick={handleMarkAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </Button>
        }
      />

      <Card title="All Notifications">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No notifications</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Read</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-neutral-100 ${!item.isRead ? 'bg-primary-50/50' : ''}`}
                  >
                    <td className="py-3 pr-4 font-medium text-black">
                      <div className="flex items-center gap-2">
                        {item.title}
                        {!item.isRead && <span className="h-2 w-2 rounded-full bg-primary-600" />}
                      </div>
                    </td>
                    <td className="py-3 pr-4"><Badge status={item.type} /></td>
                    <td className="py-3 pr-4 text-neutral-600">{item.isRead ? 'Yes' : 'No'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(item.createdAt)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <RowActions
                          onView={() => modal.openView(item)}
                          showEdit={false}
                          showDelete={false}
                        />
                        {!item.isRead && (
                          <Button size="sm" variant="ghost" onClick={() => handleMarkRead(item.id)}>
                            Mark read
                          </Button>
                        )}
                      </div>
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
        title="View Notification"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            {modal.selected && !modal.selected.isRead && (
              <Button
                onClick={() => {
                  handleMarkRead(modal.selected!.id);
                  modal.close();
                }}
              >
                Mark as Read
              </Button>
            )}
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Title" value={modal.selected.title} />
            <DetailField label="Type" value={<Badge status={modal.selected.type} />} />
            <DetailField label="Message" value={modal.selected.message} />
            <DetailField label="Read" value={modal.selected.isRead ? 'Yes' : 'No'} />
            <DetailField label="Date" value={formatDate(modal.selected.createdAt)} />
          </DetailView>
        )}
      </Modal>
    </div>
  );
}
