'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { courierApi, CourierRequest } from '@/lib/api';
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

const STATUS_OPTIONS = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function CourierPage() {
  const [items, setItems] = useState<CourierRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<CourierRequest>();
  const [form, setForm] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    recipientName: '',
    status: 'SUBMITTED',
    pickupDate: '',
    pickupTime: '',
  });

  const loadData = () => {
    setLoading(true);
    courierApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load courier requests';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () =>
    setForm({
      pickupAddress: '',
      deliveryAddress: '',
      recipientName: '',
      status: 'SUBMITTED',
      pickupDate: '',
      pickupTime: '',
    });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: CourierRequest) => {
    let dateStr = '';
    let timeStr = '';
    if (item.pickupDate) {
      const d = new Date(item.pickupDate);
      dateStr = d.toISOString().split('T')[0];
      timeStr = d.toISOString().split('T')[1].substring(0, 5);
    }
    setForm({
      pickupAddress: item.pickupAddress,
      deliveryAddress: item.deliveryAddress,
      recipientName: item.recipientName || '',
      status: item.status,
      pickupDate: dateStr,
      pickupTime: timeStr,
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let combinedPickupDate: string | undefined = undefined;
      if (form.pickupDate) {
        if (form.pickupTime) {
          combinedPickupDate = new Date(`${form.pickupDate}T${form.pickupTime}`).toISOString();
        } else {
          combinedPickupDate = new Date(`${form.pickupDate}T00:00:00`).toISOString();
        }
      }

      if (modal.isEdit && modal.selected) {
        const statusChanged = form.status !== modal.selected.status;
        await courierApi.update(modal.selected.id, {
          pickupAddress: form.pickupAddress,
          deliveryAddress: form.deliveryAddress,
          recipientName: form.recipientName,
          pickupDate: combinedPickupDate,
        });
        if (statusChanged) {
          await courierApi.updateStatus(modal.selected.id, form.status);
        }
        modal.close();
        resetForm();
        loadData();
        toast.success(
          statusChanged
            ? 'Status updated. Email notification sent to the user.'
            : 'Courier request updated successfully',
        );
      } else {
        await courierApi.create({
          pickupAddress: form.pickupAddress,
          deliveryAddress: form.deliveryAddress,
          recipientName: form.recipientName,
          pickupDate: combinedPickupDate,
        });
        modal.close();
        resetForm();
        loadData();
        toast.success('Courier request created successfully');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: CourierRequest) => {
    if (!confirm(`Delete courier request "${item.requestNumber}"?`)) return;
    try {
      await courierApi.delete(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const pagination = usePagination(items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courier"
        subtitle="Manage courier requests"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Courier
          </Button>
        }
      />

      <Card title="Courier Requests">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No courier requests found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Request #</th>
                  <th className="pb-3 pr-4 font-medium">Recipient</th>
                  <th className="pb-3 pr-4 font-medium">Pickup</th>
                  <th className="pb-3 pr-4 font-medium">Delivery</th>
                  <th className="pb-3 pr-4 font-medium">Pickup Time</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.requestNumber}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.recipientName || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600 max-w-[150px] truncate">{item.pickupAddress}</td>
                    <td className="py-3 pr-4 text-neutral-600 max-w-[150px] truncate">{item.deliveryAddress}</td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {item.pickupDate ? formatDate(item.pickupDate) : '-'}
                    </td>
                    <td className="py-3 pr-4"><Badge status={item.status} /></td>
                    <td className="py-3 pr-4 text-neutral-600">{item.createdAt ? formatDate(item.createdAt) : '-'}</td>
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
        title="View Courier Request"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={modal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Request #" value={modal.selected.requestNumber} />
            <DetailField label="Recipient" value={modal.selected.recipientName} />
            <DetailField label="Pickup Address" value={modal.selected.pickupAddress} />
            <DetailField label="Delivery Address" value={modal.selected.deliveryAddress} />
            <DetailField label="Pickup Date" value={modal.selected.pickupDate ? formatDate(modal.selected.pickupDate) : '-'} />
            <DetailField label="Status" value={<Badge status={modal.selected.status} />} />
            <DetailField label="Tracking Number" value={modal.selected.trackingNumber} />
            <DetailField label="Vendor" value={modal.selected.vendor?.name} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField
              label="Created By"
              value={
                modal.selected.createdBy
                  ? `${modal.selected.createdBy.firstName} ${modal.selected.createdBy.lastName}`
                  : '-'
              }
            />
            <DetailField label="Created At" value={modal.selected.createdAt ? formatDate(modal.selected.createdAt) : '-'} />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit Courier Request' : 'Create Courier Request'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Recipient Name"
            placeholder="Enter recipient name"
            value={form.recipientName}
            onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
          />
          <Input
            label="Pickup Address"
            placeholder="Enter pickup address"
            value={form.pickupAddress}
            onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
            required
          />
          <Input
            label="Delivery Address"
            placeholder="Enter delivery address"
            value={form.deliveryAddress}
            onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pickup Date"
              type="date"
              value={form.pickupDate}
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            />
            <Input
              label="Pickup Time"
              type="time"
              value={form.pickupTime}
              onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
            />
          </div>
          {modal.isEdit && (
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS}
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
