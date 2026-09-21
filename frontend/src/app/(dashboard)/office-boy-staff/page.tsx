'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import {
  officeBoyStaffApi,
  branchesApi,
  officeLocationsApi,
  OfficeBoyStaff,
  Branch,
  OfficeLocation,
} from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { RowActions } from '@/components/ui/row-actions';
import { DetailField, DetailView } from '@/components/ui/detail-view';
import { useRecordModal } from '@/hooks/use-record-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

export default function OfficeBoyStaffPage() {
  const [items, setItems] = useState<OfficeBoyStaff[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<OfficeBoyStaff>();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    branchId: '',
    officeLocationId: '',
    isActive: 'true',
  });

  const locationOptions = locations
    .filter((l) => l.branchId === form.branchId && l.isActive)
    .map((l) => ({ value: l.id, label: l.name }));

  const loadData = () => {
    setLoading(true);
    Promise.all([officeBoyStaffApi.list(), branchesApi.list(), officeLocationsApi.list()])
      .then(([staff, brs, locs]) => {
        setItems(staff);
        setBranches(brs);
        setLocations(locs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load staff';
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
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      branchId: '',
      officeLocationId: '',
      isActive: 'true',
    });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: OfficeBoyStaff) => {
    const branchLocations = locations.filter(
      (l) => l.branchId === item.branchId && l.isActive,
    );
    setForm({
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone || '',
      password: '',
      branchId: item.branchId || '',
      officeLocationId: item.officeLocationId || branchLocations[0]?.id || '',
      isActive: item.isActive !== false ? 'true' : 'false',
    });
    modal.openEdit(item);
  };

  const switchToEditFromView = () => {
    if (modal.selected) openEdit(modal.selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.branchId) {
      toast.error('Branch is required');
      return;
    }
    if (!form.officeLocationId && locationOptions.length > 0) {
      toast.error('Office location is required');
      return;
    }
    if (form.branchId && locationOptions.length === 0) {
      toast.error('No office location for this branch. Create one in Office Locations first.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        branchId: form.branchId,
        officeLocationId: form.officeLocationId || undefined,
        isActive: form.isActive === 'true',
      };

      if (modal.isEdit && modal.selected) {
        const updatePayload: Record<string, unknown> = { ...payload };
        if (form.password) updatePayload.password = form.password;
        await officeBoyStaffApi.update(modal.selected.id, updatePayload);
        toast.success('Staff updated');
      } else {
        await officeBoyStaffApi.create({ ...payload, password: form.password });
        toast.success('Office Boy staff created');
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

  const handleDelete = async (item: OfficeBoyStaff) => {
    if (!confirm(`Delete staff "${item.firstName} ${item.lastName}"?`)) return;
    try {
      await officeBoyStaffApi.delete(item.id);
      toast.success('Staff removed');
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const pagination = usePagination(items);

  if (loading) return <LoadingState message="Loading office boy staff..." />;

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader
          title="Office Boy Staff"
          subtitle="Register staff with phone number — email is auto-generated"
          actions={
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Create Staff
            </Button>
          }
        />
        <ErrorBanner error={error} onDismiss={() => setError('')} />

        <Card className="overflow-hidden border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Employee ID</th>
                  <th className="px-4 py-3 font-medium">Branch</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3 font-medium">
                      {item.firstName} {item.lastName}
                    </td>
                    <td className="px-4 py-3">{item.phone || '—'}</td>
                    <td className="px-4 py-3">{item.employeeId || '—'}</td>
                    <td className="px-4 py-3">{item.branch?.name || '—'}</td>
                    <td className="px-4 py-3">{item.officeLocation?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge status={item.isActive !== false ? 'ACTIVE' : 'CLOSED'} />
                    </td>
                    <td className="px-4 py-3">
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
            {!items.length && (
              <p className="p-6 text-center text-sm text-neutral-500">No office boy staff yet.</p>
            )}
          </div>
        </Card>

        <Modal
          open={modal.isView}
          onClose={modal.close}
          title="Staff Details"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={modal.close}>Close</Button>
              <Button onClick={switchToEditFromView}>Edit</Button>
            </div>
          }
        >
          {modal.selected && (
            <DetailView>
              <DetailField label="Name" value={`${modal.selected.firstName} ${modal.selected.lastName}`} />
              <DetailField label="Phone" value={modal.selected.phone} />
              <DetailField label="Employee ID" value={modal.selected.employeeId} />
              <DetailField label="Branch" value={modal.selected.branch?.name} />
              <DetailField label="Office Location" value={modal.selected.officeLocation?.name} />
              <DetailField label="Status" value={modal.selected.isActive !== false ? 'Active' : 'Inactive'} />
            </DetailView>
          )}
        </Modal>

        <Modal
          open={modal.isCreate || modal.isEdit}
          onClose={modal.close}
          title={modal.isEdit ? 'Edit Staff' : 'Create Office Boy Staff'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <Input
              label="Mobile Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              placeholder="10-digit mobile number"
            />
            <Input
              label={modal.isEdit ? 'Password (leave blank to keep)' : 'Password'}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!modal.isEdit}
            />
            <Select
              label="Branch"
              value={form.branchId}
              onChange={(e) => {
                const newBranchId = e.target.value;
                const branchLocations = locations.filter(
                  (l) => l.branchId === newBranchId && l.isActive,
                );
                setForm((prev) => ({
                  ...prev,
                  branchId: newBranchId,
                  officeLocationId:
                    branchLocations.find((l) => l.id === prev.officeLocationId)?.id ||
                    branchLocations[0]?.id ||
                    '',
                }));
              }}
              required
              placeholder="Select branch"
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
            {form.branchId && locationOptions.length > 0 && (
              <Select
                label="Office Location"
                value={form.officeLocationId}
                onChange={(e) => setForm({ ...form, officeLocationId: e.target.value })}
                required
                placeholder="Select office location"
                options={locationOptions}
              />
            )}
            {form.branchId && locationOptions.length === 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                No active office location for this branch. Create one under Office Locations first.
              </div>
            )}
            {modal.isEdit && (
              <Select
                label="Status"
                value={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.value })}
                options={[
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ]}
              />
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={modal.close}>Cancel</Button>
              <Button type="submit" loading={submitting}>
                {modal.isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminGuard>
  );
}
