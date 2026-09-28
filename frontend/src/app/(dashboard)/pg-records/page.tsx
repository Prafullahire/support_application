'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { pgRecordsApi, branchesApi, PgRecord, Branch } from '@/lib/api';
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

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'RENEWED', label: 'Renewed' },
  { value: 'CLOSED', label: 'Closed' },
];

const EMPTY_FORM = {
  employeeName: '',
  raisedBy: '',
  location: '',
  address: '',
  rentAmount: '',
  agreementStart: '',
  agreementEnd: '',
  contactPhone: '',
  fileAttachment: '',
  reminderDays: '5',
  notes: '',
  branchId: '',
  status: 'ACTIVE',
};

export default function PgRecordsPage() {
  const [items, setItems] = useState<PgRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<PgRecord>();
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = () => {
    setLoading(true);
    Promise.all([pgRecordsApi.list(), branchesApi.list()])
      .then(([records, brs]) => {
        setItems(records);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load PG records';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => setForm(EMPTY_FORM);

  const openCreate = () => { resetForm(); modal.openCreate(); };

  const openEdit = (item: PgRecord) => {
    setForm({
      employeeName: item.employeeName,
      raisedBy: item.raisedBy || '',
      location: item.location || '',
      address: item.address,
      rentAmount: String(item.rentAmount),
      agreementStart: item.agreementStart.split('T')[0],
      agreementEnd: item.agreementEnd.split('T')[0],
      contactPhone: item.contactPhone || '',
      fileAttachment: item.fileAttachment || '',
      reminderDays: String(item.reminderDays ?? 5),
      notes: item.notes || '',
      branchId: item.branch?.id || '',
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
        raisedBy: form.raisedBy || undefined,
        location: form.location || undefined,
        address: form.address,
        rentAmount: Number(form.rentAmount),
        agreementStart: form.agreementStart,
        agreementEnd: form.agreementEnd,
        contactPhone: form.contactPhone || undefined,
        fileAttachment: form.fileAttachment || undefined,
        reminderDays: form.reminderDays ? Number(form.reminderDays) : 5,
        notes: form.notes || undefined,
        branchId: form.branchId || undefined,
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

  const pagination = usePagination(items);

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
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No PG records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Employee</th>
                  <th className="pb-3 pr-4 font-medium">Raised By</th>
                  <th className="pb-3 pr-4 font-medium">Location</th>
                  <th className="pb-3 pr-4 font-medium">Address</th>
                  <th className="pb-3 pr-4 font-medium">Rent</th>
                  <th className="pb-3 pr-4 font-medium">Agreement</th>
                  <th className="pb-3 pr-4 font-medium">Reminder</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.employeeName}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.raisedBy || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.location || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600 max-w-[180px] truncate">{item.address}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatCurrency(item.rentAmount)}</td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {formatDate(item.agreementStart)} – {formatDate(item.agreementEnd)}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {item.reminderDays ?? 5} days before
                    </td>
                    <td className="py-3 pr-4"><Badge status={item.status} /></td>
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

      {/* View Modal */}
      <Modal
        open={modal.isView}
        onClose={modal.close}
        title="View PG Record"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={modal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Employee Name" value={modal.selected.employeeName} />
            <DetailField label="Raised By" value={modal.selected.raisedBy || '-'} />
            <DetailField label="Location" value={modal.selected.location || '-'} />
            <DetailField label="Branch" value={modal.selected.branch?.name || '-'} />
            <DetailField label="Address" value={modal.selected.address} />
            <DetailField label="Rent Amount" value={formatCurrency(modal.selected.rentAmount)} />
            <DetailField label="Agreement Start" value={formatDate(modal.selected.agreementStart)} />
            <DetailField label="Agreement End" value={formatDate(modal.selected.agreementEnd)} />
            <DetailField label="Contact Phone" value={modal.selected.contactPhone || '-'} />
            <DetailField label="Email Reminder" value={`${modal.selected.reminderDays ?? 5} days before expiry`} />
            <DetailField label="Status" value={<Badge status={modal.selected.status} />} />
            <DetailField label="Notes" value={modal.selected.notes || '-'} />
            <DetailField
              label="Attachment"
              value={
                modal.selected.fileAttachment
                  ? <a href={modal.selected.fileAttachment} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">View Document</a>
                  : '-'
              }
            />
            <DetailField label="Created At" value={formatDate(modal.selected.createdAt)} />
          </DetailView>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit PG Record' : 'Add PG Record'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee Name"
              placeholder="Enter employee name"
              value={form.employeeName}
              onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
              required
            />
            <Input
              label="Raised By (Person Name)"
              placeholder="Enter person name"
              value={form.raisedBy}
              onChange={(e) => setForm({ ...form, raisedBy: e.target.value })}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="Enter location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Select
              label="Branch"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              options={[{ value: '', label: 'Select branch...' }, ...branches.map((b) => ({ value: b.id, label: b.name }))]}
            />
          </div>

          {/* Address */}
          <Input
            label="PG Address"
            placeholder="Enter address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rent Amount"
              placeholder="Enter amount"
              type="number"
              value={form.rentAmount}
              onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="Enter contact phone"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Email Reminder (days before expiry)"
                type="number"
                min="1"
                max="60"
                value={form.reminderDays}
                onChange={(e) => setForm({ ...form, reminderDays: e.target.value })}
              />
              <p className="mt-1 text-xs text-neutral-400">
                An email will be sent {form.reminderDays || 5} days before the agreement expires
              </p>
            </div>
            {modal.isEdit && (
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={STATUS_OPTIONS}
              />
            )}
          </div>

          {/* Notes */}
          <Input
            label="Notes (Optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          {/* File Attachment */}
          <FileUpload
            module="pg-records"
            recordId={modal.selected?.id || 'new'}
            attachments={
              form.fileAttachment
                ? [{ id: '1', fileName: 'PG Document', fileUrl: form.fileAttachment, mimeType: 'application/pdf', fileSize: 0 } as any]
                : []
            }
            onUpload={(att) => setForm({ ...form, fileAttachment: att.fileUrl })}
            onDelete={() => setForm({ ...form, fileAttachment: '' })}
            label="File Attachment (Agreement / Document)"
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
