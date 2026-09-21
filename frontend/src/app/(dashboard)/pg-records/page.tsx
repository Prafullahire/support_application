'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { pgRecordsApi, PgRecord } from '@/lib/api';
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
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

type PgRecordWithMeta = PgRecord & { createdAt?: string; tenantName?: string };

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'RENEWED', label: 'Renewed' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function PgRecordsPage() {
  const [items, setItems] = useState<PgRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<PgRecord>();
  const [form, setForm] = useState({
    employeeName: '',
    address: '',
    rentAmount: '',
    agreementStart: '',
    agreementEnd: '',
    status: 'ACTIVE',
  });

  const loadData = () => {
    setLoading(true);
    pgRecordsApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load PG records';
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
      employeeName: '',
      address: '',
      rentAmount: '',
      agreementStart: '',
      agreementEnd: '',
      status: 'ACTIVE',
    });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: PgRecord) => {
    setForm({
      employeeName: item.employeeName,
      address: item.address,
      rentAmount: String(item.rentAmount),
      agreementStart: item.agreementStart.split('T')[0],
      agreementEnd: item.agreementEnd.split('T')[0],
      status: item.status,
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        employeeName: form.employeeName,
        address: form.address,
        rentAmount: Number(form.rentAmount),
        agreementStart: form.agreementStart,
        agreementEnd: form.agreementEnd,
        ...(modal.isEdit ? { status: form.status } : {}),
      };
      if (modal.isEdit && modal.selected) {
        await pgRecordsApi.update(modal.selected.id, payload);
        toast.success('PG record updated successfully');
      } else {
        await pgRecordsApi.create(payload);
        toast.success('PG record created successfully');
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

  const handleDelete = async (item: PgRecord) => {
    if (!confirm(`Delete PG record for "${item.employeeName}"?`)) return;
    try {
      await pgRecordsApi.delete(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const pgItems: PgRecordWithMeta[] = items.map((item) => ({
    ...item,
    tenantName: item.employeeName,
  }));
  const pagination = usePagination(pgItems);

  return (
    <div className="space-y-6">
      <PageHeader
        title="PG Records"
        subtitle="Employee PG accommodation records"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        }
      />

      <Card title="PG Records">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : pgItems.length === 0 ? (
          <p className="text-center text-neutral-500">No PG records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Employee</th>
                  <th className="pb-3 pr-4 font-medium">Address</th>
                  <th className="pb-3 pr-4 font-medium">Rent</th>
                  <th className="pb-3 pr-4 font-medium">Agreement</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.employeeName}</td>
                    <td className="py-3 pr-4 text-neutral-600 max-w-[200px] truncate">{item.address}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatCurrency(item.rentAmount)}</td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {formatDate(item.agreementStart)} - {formatDate(item.agreementEnd)}
                    </td>
                    <td className="py-3 pr-4"><Badge status={item.status} /></td>
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
        title="View PG Record"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={modal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Employee" value={modal.selected.employeeName} />
            <DetailField label="Address" value={modal.selected.address} />
            <DetailField label="Rent" value={formatCurrency(modal.selected.rentAmount)} />
            <DetailField label="Agreement Start" value={formatDate(modal.selected.agreementStart)} />
            <DetailField label="Agreement End" value={formatDate(modal.selected.agreementEnd)} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField label="Status" value={<Badge status={modal.selected.status} />} />
            <DetailField
              label="Created At"
              value={
                (modal.selected as PgRecordWithMeta).createdAt
                  ? formatDate((modal.selected as PgRecordWithMeta).createdAt!)
                  : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit PG Record' : 'Add PG Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Employee Name"
            value={form.employeeName}
            onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
            required
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <Input
            label="Rent Amount"
            type="number"
            value={form.rentAmount}
            onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
            required
          />
          <Input
            label="Agreement Start"
            type="date"
            value={form.agreementStart}
            onChange={(e) => setForm({ ...form, agreementStart: e.target.value })}
            required
          />
          <Input
            label="Agreement End"
            type="date"
            value={form.agreementEnd}
            onChange={(e) => setForm({ ...form, agreementEnd: e.target.value })}
            required
          />
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
