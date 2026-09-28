'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import { departmentsApi, branchesApi, Department, Branch } from '@/lib/api';
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

type DepartmentWithDate = Department & { createdAt?: string; description?: string };

const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export default function DepartmentsPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<Department>();
  const [form, setForm] = useState({ name: '', branchId: '', isActive: 'true' });

  const loadData = () => {
    setLoading(true);
    Promise.all([departmentsApi.list(), branchesApi.list()])
      .then(([deps, brs]) => {
        setItems(deps);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load departments';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setForm({ name: '', branchId: '', isActive: 'true' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: Department) => {
    setForm({
      name: item.name,
      branchId: item.branchId || '',
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
        branchId: form.branchId || undefined,
        ...(modal.isEdit ? { isActive: form.isActive === 'true' } : {}),
      };
      if (modal.isEdit && modal.selected) {
        await departmentsApi.update(modal.selected.id, payload);
        toast.success('Department updated successfully');
      } else {
        await departmentsApi.create(payload);
        toast.success('Department created successfully');
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

  const handleDelete = async (item: Department) => {
    if (!confirm(`Delete department "${item.name}"?`)) return;
    try {
      await departmentsApi.delete(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const getBranchName = (branchId?: string) => {
    if (!branchId) return '-';
    const branch = branches.find((b) => b.id === branchId);
    return branch?.name || '-';
  };

  const pagination = usePagination(items);

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader
          title="Departments"
          subtitle="Manage organization departments"
          actions={
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Department
            </Button>
          }
        />

        <Card title="All Departments">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          ) : items.length === 0 ? (
            <p className="text-center text-neutral-500">No departments found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4 font-medium text-black">{item.name}</td>
                      <td className="py-3 pr-4">
                        <Badge status={item.isActive ? 'ACTIVE' : 'CANCELLED'} />
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">{(item as DepartmentWithDate).createdAt ? formatDate((item as DepartmentWithDate).createdAt!) : '-'}</td>
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
          title="View Department"
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
              <DetailField label="Branch" value={getBranchName(modal.selected.branchId)} />
              <DetailField
                label="Status"
                value={<Badge status={modal.selected.isActive ? 'ACTIVE' : 'CANCELLED'} />}
              />
              <DetailField
                label="Created At"
                value={
                  (modal.selected as DepartmentWithDate).createdAt
                    ? formatDate((modal.selected as DepartmentWithDate).createdAt!)
                    : '-'
                }
              />
            </DetailView>
          )}
        </Modal>

        <Modal
          open={modal.isCreate || modal.isEdit}
          onClose={modal.close}
          title={modal.isEdit ? 'Edit Department' : 'Add Department'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" placeholder="Enter department name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            {branches.length > 0 && (
              <Select
                label="Branch"
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
              />
            )}
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
