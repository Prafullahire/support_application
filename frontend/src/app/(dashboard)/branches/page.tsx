'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import { branchesApi, Branch } from '@/lib/api';
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
import { useAuthStore } from '@/lib/auth-store';
import { isSuperAdmin } from '@/lib/roles';

type BranchWithDate = Branch & { createdAt?: string };

const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export default function BranchesPage() {
  const { user } = useAuthStore();
  const canManageBranches = isSuperAdmin(user?.role);
  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<Branch>();
  const [form, setForm] = useState({ name: '', code: '', address: '', city: '', isActive: 'true' });

  const loadData = () => {
    setLoading(true);
    branchesApi
      .list()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load branches';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setForm({ name: '', code: '', address: '', city: '', isActive: 'true' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: Branch) => {
    setForm({
      name: item.name,
      code: item.code,
      address: item.address || '',
      city: item.city || '',
      isActive: item.isActive ? 'true' : 'false',
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        address: form.address || undefined,
        city: form.city || undefined,
        ...(modal.isEdit ? { isActive: form.isActive === 'true' } : {}),
      };
      if (modal.isEdit && modal.selected) {
        await branchesApi.update(modal.selected.id, payload);
        toast.success('Branch updated successfully');
      } else {
        await branchesApi.create(payload);
        toast.success('Branch created successfully');
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

  const handleDelete = async (item: Branch) => {
    if (!confirm(`Delete branch "${item.name}"?`)) return;
    try {
      await branchesApi.delete(item.id);
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
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader
          title="Branches"
          subtitle="Manage organization branches"
          actions={
            canManageBranches ? (
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" /> Add Branch
              </Button>
            ) : undefined
          }
        />

        <Card title="All Branches">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          ) : items.length === 0 ? (
            <p className="text-center text-neutral-500">No branches found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Code</th>
                    <th className="pb-3 pr-4 font-medium">City</th>
                    <th className="pb-3 pr-4 font-medium">Address</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4 font-medium text-black">{item.name}</td>
                      <td className="py-3 pr-4 text-neutral-600">{item.code}</td>
                      <td className="py-3 pr-4 text-neutral-600">{item.city || '-'}</td>
                      <td className="py-3 pr-4 text-neutral-600">{item.address || '-'}</td>
                      <td className="py-3 pr-4">
                        <Badge status={item.isActive ? 'ACTIVE' : 'CANCELLED'} />
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">{formatDate((item as BranchWithDate).createdAt)}</td>
                      <td className="py-3">
                        <RowActions
                          onView={() => modal.openView(item)}
                          onEdit={() => openEdit(item)}
                          onDelete={canManageBranches ? () => handleDelete(item) : undefined}
                          showDelete={canManageBranches}
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
          title="View Branch"
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
              <DetailField label="Code" value={modal.selected.code} />
              <DetailField label="City" value={modal.selected.city} />
              <DetailField label="Address" value={modal.selected.address} />
              <DetailField
                label="Status"
                value={<Badge status={modal.selected.isActive ? 'ACTIVE' : 'CANCELLED'} />}
              />
              <DetailField
                label="Created At"
                value={
                  (modal.selected as BranchWithDate).createdAt
                    ? formatDate((modal.selected as BranchWithDate).createdAt!)
                    : '-'
                }
              />
            </DetailView>
          )}
        </Modal>

        <Modal
          open={modal.isCreate || modal.isEdit}
          onClose={modal.close}
          title={modal.isEdit ? 'Edit Branch' : 'Add Branch'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            {modal.isEdit && (
              <Select
                label="Status"
                value={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.value })}
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
    </AdminGuard>
  );
}
