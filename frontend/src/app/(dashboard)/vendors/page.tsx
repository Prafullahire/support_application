'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import { vendorsApi, Vendor } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type VendorWithDate = Vendor & { createdAt?: string; contactPerson?: string };

export default function VendorsPage() {
  const [items, setItems] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<Vendor>();
  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '' });

  const loadData = () => {
    setLoading(true);
    vendorsApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load vendors';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setForm({ name: '', contact: '', email: '', phone: '' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: Vendor) => {
    setForm({
      name: item.name,
      contact: item.contact || '',
      email: item.email || '',
      phone: item.phone || '',
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal.isEdit && modal.selected) {
        await vendorsApi.update(modal.selected.id, form);
        toast.success('Vendor updated successfully');
      } else {
        await vendorsApi.create(form);
        toast.success('Vendor created successfully');
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

  const handleDelete = async (item: Vendor) => {
    if (!confirm(`Delete vendor "${item.name}"?`)) return;
    try {
      await vendorsApi.delete(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const vendorItems = items.map((item) => ({
    ...item,
    contactPerson: item.contact,
  }));
  const pagination = usePagination(vendorItems);

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader
          title="Vendors"
          subtitle="Manage vendor contacts"
          actions={
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Vendor
            </Button>
          }
        />

        <Card title="All Vendors">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          ) : vendorItems.length === 0 ? (
            <p className="text-center text-neutral-500">No vendors found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Contact</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Phone</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4 font-medium text-black">{item.name}</td>
                      <td className="py-3 pr-4 text-neutral-600">{item.contact || '-'}</td>
                      <td className="py-3 pr-4 text-neutral-600">{item.email || '-'}</td>
                      <td className="py-3 pr-4 text-neutral-600">{item.phone || '-'}</td>
                      <td className="py-3 pr-4 text-neutral-600">{formatDate((item as VendorWithDate).createdAt)}</td>
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
          title="View Vendor"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={modal.close}>Close</Button>
              <Button onClick={modal.switchToEdit}>Edit</Button>
            </div>
          }
        >
          {modal.selected && (
            <DetailView>
              <DetailField label="Name" value={modal.selected.name} />
              <DetailField label="Contact Person" value={modal.selected.contact} />
              <DetailField label="Email" value={modal.selected.email} />
              <DetailField label="Phone" value={modal.selected.phone} />
              <DetailField
                label="Created At"
                value={
                  (modal.selected as VendorWithDate).createdAt
                    ? formatDate((modal.selected as VendorWithDate).createdAt!)
                    : '-'
                }
              />
            </DetailView>
          )}
        </Modal>

        <Modal
          open={modal.isCreate || modal.isEdit}
          onClose={modal.close}
          title={modal.isEdit ? 'Edit Vendor' : 'Add Vendor'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" placeholder="Enter vendor name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input
              label="Contact Person"
              placeholder="Enter contact person"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <Input
              label="Email"
              placeholder="Enter email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input label="Phone" placeholder="Enter phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={modal.close}>Cancel</Button>
              <Button type="submit" loading={submitting}>{modal.isEdit ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminGuard>
  );
}
