'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { amcApi, AmcRecord } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { RowActions } from '@/components/ui/row-actions';
import { DetailField, DetailView } from '@/components/ui/detail-view';
import { useRecordModal } from '@/hooks/use-record-modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import FileUpload from '@/components/ui/file-upload';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

type AmcWithMeta = AmcRecord & { createdAt?: string };

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'RENEWED', label: 'Renewed' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function AmcPage() {
  const [items, setItems] = useState<AmcRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<AmcRecord>();
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    amount: '',
    status: 'ACTIVE',
    emailNotification: 'false',
    documentUrl: '',
  });

  const loadData = () => {
    setLoading(true);
    amcApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load AMC records';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () =>
    setForm({ title: '', startDate: '', endDate: '', amount: '', status: 'ACTIVE', emailNotification: 'false', documentUrl: '' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: AmcRecord) => {
    setForm({
      title: item.title,
      startDate: item.startDate.split('T')[0],
      endDate: item.endDate.split('T')[0],
      amount: item.amount ? String(item.amount) : '',
      status: item.status,
      emailNotification: item.emailNotification ? 'true' : 'false',
      documentUrl: item.documentUrl || '',
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        startDate: form.startDate,
        endDate: form.endDate,
        amount: form.amount ? Number(form.amount) : undefined,
        emailNotification: form.emailNotification === 'true',
        documentUrl: form.documentUrl || undefined,
        ...(modal.isEdit ? { status: form.status } : {}),
      };
      if (modal.isEdit && modal.selected) {
        await amcApi.update(modal.selected.id, payload);
        toast.success('AMC record updated successfully');
      } else {
        await amcApi.create(payload);
        toast.success('AMC record created successfully');
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

  const handleDelete = async (item: AmcRecord) => {
    if (!confirm(`Delete AMC record "${item.title}"?`)) return;
    try {
      await amcApi.delete(item.id);
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
        title="AMC Records"
        subtitle="Annual maintenance contract tracking"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add AMC
          </Button>
        }
      />

      <Card title="AMC Records">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No AMC records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium">Vendor</th>
                  <th className="pb-3 pr-4 font-medium">Start</th>
                  <th className="pb-3 pr-4 font-medium">End</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.title}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.vendor?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(item.startDate)}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(item.endDate)}</td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {item.amount ? formatCurrency(item.amount) : '-'}
                    </td>
                    <td className="py-3 pr-4"><Badge status={item.status} /></td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {formatDate((item as AmcWithMeta).createdAt || item.startDate)}
                    </td>
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
        title="View AMC Record"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={modal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Title" value={modal.selected.title} />
            <DetailField label="Vendor" value={modal.selected.vendor?.name} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField label="Start Date" value={formatDate(modal.selected.startDate)} />
            <DetailField label="End Date" value={formatDate(modal.selected.endDate)} />
            <DetailField
              label="Amount"
              value={modal.selected.amount ? formatCurrency(modal.selected.amount) : '-'}
            />
            <DetailField label="Status" value={<Badge status={modal.selected.status} />} />
            <DetailField
              label="Email Notification"
              value={modal.selected.emailNotification ? 'Enabled' : 'Disabled'}
            />
            <DetailField 
              label="Document" 
              value={modal.selected.documentUrl ? <a href={modal.selected.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">View Document</a> : '-'} 
            />
            <DetailField
              label="Created At"
              value={
                (modal.selected as AmcWithMeta).createdAt
                  ? formatDate((modal.selected as AmcWithMeta).createdAt!)
                  : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit AMC Record' : 'Add AMC Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" placeholder="Enter title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />
          <Input
            label="Amount"
            placeholder="Enter amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          {modal.isEdit && (
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS}
            />
          )}
          <Select
            label="Email Notification"
            value={form.emailNotification}
            onChange={(e) => setForm({ ...form, emailNotification: e.target.value })}
            options={[
              { value: 'true', label: 'Enabled' },
              { value: 'false', label: 'Disabled' },
            ]}
          />
          <FileUpload
            module="amc"
            recordId={modal.selected?.id || 'new'}
            attachments={form.documentUrl ? [{ id: '1', fileName: 'Document', fileUrl: form.documentUrl, mimeType: 'application/pdf', fileSize: 0 } as any] : []}
            onUpload={(att) => setForm({ ...form, documentUrl: att.fileUrl })}
            onDelete={() => setForm({ ...form, documentUrl: '' })}
            label="AMC Document Attachment"
            multiple={false}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={modal.close}>Cancel</Button>
            <Button type="submit" loading={submitting}>{modal.isEdit ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
