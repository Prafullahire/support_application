'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { assetsApi, branchesApi, Asset, AssetCategory, Branch } from '@/lib/api';
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

type AssetWithDate = Asset & { createdAt?: string };

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'UNDER_REPAIR', label: 'Under Repair' },
  { value: 'LOST', label: 'Lost' },
];

export default function AssetsPage() {
  const [items, setItems] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<Asset>();
  const [form, setForm] = useState({
    name: '',
    serialNumber: '',
    categoryId: '',
    status: 'AVAILABLE',
    employeeCode: '',
    employeeName: '',
    location: '',
    branchId: '',
    assignedDate: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([assetsApi.list(), assetsApi.categories(), branchesApi.list()])
      .then(([assets, cats, brs]) => {
        setItems(assets);
        setCategories(cats);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load assets';
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
      name: '',
      serialNumber: '',
      categoryId: '',
      status: 'AVAILABLE',
      employeeCode: '',
      employeeName: '',
      location: '',
      branchId: '',
      assignedDate: '',
    });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: Asset) => {
    setForm({
      name: item.name,
      serialNumber: item.serialNumber || '',
      categoryId: item.categoryId || '',
      status: item.status,
      employeeCode: item.employeeCode || '',
      employeeName: item.employeeName || '',
      location: item.location || '',
      branchId: item.branchId || '',
      assignedDate: item.assignedDate ? item.assignedDate.split('T')[0] : '',
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        serialNumber: form.serialNumber || undefined,
        categoryId: form.categoryId || undefined,
        employeeCode: form.employeeCode || undefined,
        employeeName: form.employeeName || undefined,
        location: form.location || undefined,
        branchId: form.branchId || undefined,
        assignedDate: form.assignedDate || undefined,
        ...(modal.isEdit ? { status: form.status } : {}),
      };
      if (modal.isEdit && modal.selected) {
        await assetsApi.update(modal.selected.id, payload);
        toast.success('Asset updated successfully');
      } else {
        await assetsApi.create(payload);
        toast.success('Asset created successfully');
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

  const handleDelete = async (item: Asset) => {
    if (!confirm(`Delete asset "${item.name}"?`)) return;
    try {
      await assetsApi.delete(item.id);
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
        title="Assets"
        subtitle="Manage company assets"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Assign Asset
          </Button>
        }
      />

      <Card title="Asset Inventory">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No assets found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Serial Number</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Employee Code</th>
                  <th className="pb-3 pr-4 font-medium">Employee Name</th>
                  <th className="pb-3 pr-4 font-medium">Location</th>
                  <th className="pb-3 pr-4 font-medium">Branch</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.name}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.serialNumber || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.category?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.employeeCode || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.employeeName || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.location || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.branch?.name || '-'}</td>
                    <td className="py-3 pr-4"><Badge status={item.status} /></td>
                    <td className="py-3 pr-4 text-neutral-600">{(item as AssetWithDate).createdAt ? formatDate((item as AssetWithDate).createdAt!) : '-'}</td>
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
        title="View Asset"
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
            <DetailField label="Serial Number" value={modal.selected.serialNumber} />
            <DetailField label="Category" value={modal.selected.category?.name} />
            <DetailField label="Employee Code" value={modal.selected.employeeCode || '-'} />
            <DetailField label="Employee Name" value={modal.selected.employeeName || '-'} />
            <DetailField label="Location" value={modal.selected.location || '-'} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField label="Assigned Date" value={modal.selected.assignedDate ? formatDate(modal.selected.assignedDate) : '-'} />
            <DetailField label="Status" value={<Badge status={modal.selected.status} />} />
            <DetailField
              label="Created At"
              value={
                (modal.selected as AssetWithDate).createdAt
                  ? formatDate((modal.selected as AssetWithDate).createdAt!)
                  : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit Asset Assignment' : 'Assign Asset'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee Code"
              placeholder="Enter employee code"
              value={form.employeeCode}
              onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
            />
            <Input
              label="Employee Name"
              placeholder="Enter employee name"
              value={form.employeeName}
              onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" placeholder="Enter asset name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input
              label="Serial Number"
              placeholder="Enter serial number"
              value={form.serialNumber}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Branch"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              options={[{ value: '', label: 'Select branch...' }, ...branches.map((b) => ({ value: b.id, label: b.name }))]}
            />
            <Input
              label="Location"
              placeholder="Enter location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Assigned Date"
              type="date"
              value={form.assignedDate}
              onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
            />
            {categories.length > 0 && (
              <Select
                label="Category"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            )}
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
