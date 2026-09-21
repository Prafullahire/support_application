'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { idCardsApi, IdCard } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

type IdCardWithMeta = IdCard & {
  createdAt?: string;
  status: string;
  employeeName: string;
};

const AVAILABILITY_OPTIONS = [
  { value: 'true', label: 'Available' },
  { value: 'false', label: 'Assigned' },
];

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ASSIGNED', label: 'Assigned' },
];

export default function IdCardsPage() {
  const [items, setItems] = useState<IdCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<IdCard>();
  const [form, setForm] = useState({ cardNumber: '', isAvailable: 'true' });

  const loadData = () => {
    setLoading(true);
    idCardsApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load ID cards';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setForm({ cardNumber: '', isAvailable: 'true' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: IdCard) => {
    setForm({
      cardNumber: item.cardNumber,
      isAvailable: item.isAvailable ? 'true' : 'false',
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        cardNumber: form.cardNumber,
        ...(modal.isEdit ? { isAvailable: form.isAvailable === 'true' } : {}),
      };
      if (modal.isEdit && modal.selected) {
        await idCardsApi.update(modal.selected.id, payload);
        toast.success('ID card updated successfully');
      } else {
        await idCardsApi.create({ cardNumber: form.cardNumber });
        toast.success('ID card created successfully');
      }
      modal.close();
      resetForm();
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: IdCard) => {
    if (!confirm(`Delete ID card "${item.cardNumber}"?`)) return;
    try {
      await idCardsApi.delete(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const cardItems: IdCardWithMeta[] = items.map((item) => ({
    ...item,
    status: item.isAvailable ? 'AVAILABLE' : 'ASSIGNED',
    employeeName: item.assignedTo
      ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}`
      : '',
  }));
  const pagination = usePagination(cardItems);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ID Cards"
        subtitle="Manage employee ID cards"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Card
          </Button>
        }
      />

      <Card title="ID Card Inventory">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : cardItems.length === 0 ? (
          <p className="text-center text-neutral-500">No ID cards found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Card Number</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Assigned To</th>
                  <th className="pb-3 pr-4 font-medium">Branch</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.cardNumber}</td>
                    <td className="py-3 pr-4">
                      <Badge status={item.isAvailable ? 'AVAILABLE' : 'ASSIGNED'} />
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {item.assignedTo
                        ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}`
                        : '-'}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{item.branch?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(item.createdAt)}</td>
                    <td className="py-3">
                      <RowActions
                        onView={() => modal.openView(item)}
                        onEdit={() => openEdit(item)}
                        onDelete={() => handleDelete(item)}
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
        title="View ID Card"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={modal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Card Number" value={modal.selected.cardNumber} />
            <DetailField
              label="Status"
              value={<Badge status={modal.selected.isAvailable ? 'AVAILABLE' : 'ASSIGNED'} />}
            />
            <DetailField
              label="Assigned To"
              value={
                modal.selected.assignedTo
                  ? `${modal.selected.assignedTo.firstName} ${modal.selected.assignedTo.lastName}`
                  : '-'
              }
            />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField
              label="Created At"
              value={
                (modal.selected as IdCardWithMeta).createdAt
                  ? formatDate((modal.selected as IdCardWithMeta).createdAt!)
                  : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit ID Card' : 'Add ID Card'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Card Number"
            value={form.cardNumber}
            onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
            required
          />
          {modal.isEdit && (
            <Select
              label="Availability"
              value={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.value })}
              options={AVAILABILITY_OPTIONS}
            />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={modal.close}>Cancel</Button>
            <Button type="submit" loading={submitting}>{modal.isEdit ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
