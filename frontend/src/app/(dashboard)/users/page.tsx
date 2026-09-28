'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import {
  usersApi,
  branchesApi,
  departmentsApi,
  officeLocationsApi,
  User,
  Branch,
  Department,
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
import { formatDate, getUserDisplayEmail, getUserDisplayPhone, isSystemGeneratedEmail } from '@/lib/utils';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';
import { useAuthStore } from '@/lib/auth-store';
import { isSuperAdmin } from '@/lib/roles';

type UserWithDate = User & { createdAt?: string };

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const roleOptions = [
    ...(isSuperAdmin(currentUser?.role)
      ? [{ value: 'SUPER_ADMIN', label: 'Super Admin' }]
      : []),
    { value: 'ADMIN', label: 'Admin' },
    { value: 'OFFICE_BOY', label: 'Office Boy' },
  ];
  const [items, setItems] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<User>();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'ADMIN',
    branchId: '',
    departmentId: '',
    employeeId: '',
    officeLocationId: '',
    joiningDate: '',
    leavingDate: '',
    address: '',
  });

  const isOfficeBoy = form.role === 'OFFICE_BOY';

  const loadData = () => {
    setLoading(true);
    Promise.all([
      usersApi.list(),
      branchesApi.list(),
      departmentsApi.list(),
      officeLocationsApi.list(),
    ])
      .then(([users, brs, deps, locs]) => {
        setItems(users);
        setBranches(brs);
        setDepartments(deps);
        setLocations(locs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load users';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const locationOptions = locations
    .filter((l) => l.branchId === form.branchId && l.isActive)
    .map((l) => ({ value: l.id, label: l.name }));

  const resetForm = () =>
    setForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'ADMIN',
      branchId: '',
      departmentId: '',
      employeeId: '',
      officeLocationId: '',
      joiningDate: '',
      leavingDate: '',
      address: '',
    });

  const openCreate = () => {
    resetForm();
    if (currentUser?.branchId && !isSuperAdmin(currentUser.role)) {
      setForm((prev) => ({ ...prev, branchId: currentUser.branchId || '' }));
    }
    modal.openCreate();
  };

  const openEdit = (item: User) => {
    const branchLocations = locations.filter(
      (l) => l.branchId === item.branchId && l.isActive,
    );
    setForm({
      email: isSystemGeneratedEmail(item.email) ? '' : item.email,
      password: '',
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone || '',
      role: item.role || 'ADMIN',
      branchId: item.branchId || '',
      departmentId: item.departmentId || '',
      employeeId: item.employeeId || '',
      officeLocationId: item.officeLocationId || branchLocations[0]?.id || '',
      joiningDate: item.joiningDate ? item.joiningDate.slice(0, 10) : '',
      leavingDate: item.leavingDate ? item.leavingDate.slice(0, 10) : '',
      address: item.address || '',
    });
    modal.openEdit(item);
  };

  const switchToEditFromView = () => {
    if (modal.selected) {
      openEdit(modal.selected);
    }
  };

  const handleRoleChange = (role: string) => {
    setForm((prev) => ({
      ...prev,
      role,
      departmentId: role === 'OFFICE_BOY' ? '' : prev.departmentId,
      employeeId: role === 'OFFICE_BOY' ? prev.employeeId : '',
      officeLocationId: role === 'OFFICE_BOY' ? prev.officeLocationId : '',
      joiningDate: role === 'OFFICE_BOY' ? prev.joiningDate : '',
      leavingDate: role === 'OFFICE_BOY' ? prev.leavingDate : '',
      address: role === 'OFFICE_BOY' ? prev.address : '',
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isOfficeBoy) {
      if (!form.branchId) {
        toast.error('Branch is required for Office Boy role');
        return;
      }
      if (!form.phone?.trim()) {
        toast.error('Mobile number is required for Office Boy role');
        return;
      }
      if (!form.officeLocationId && locationOptions.length > 0) {
        toast.error('Office location is required for Office Boy role');
        return;
      }
      if (form.branchId && locationOptions.length === 0) {
        toast.error('No office location exists for the selected branch. Create one in Office Locations first.');
        return;
      }
    } else if (!form.email?.trim()) {
      toast.error('Email is required');
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        role: form.role,
        branchId: form.branchId || undefined,
      };
      if (!isOfficeBoy) {
        payload.email = form.email;
      } else if (form.email) {
        payload.email = form.email;
      }

      if (isOfficeBoy) {
        payload.phone = form.phone;
        payload.departmentId = undefined;
        payload.officeLocationId = form.officeLocationId || undefined;
        payload.joiningDate = form.joiningDate || undefined;
        payload.leavingDate = form.leavingDate || undefined;
        payload.address = form.address.trim() || undefined;
      } else {
        payload.departmentId = form.departmentId || undefined;
      }

      if (modal.isEdit && modal.selected) {
        if (form.password) {
          payload.password = form.password;
        }
        await usersApi.update(modal.selected.id, payload);
        toast.success('User updated successfully');
      } else {
        await usersApi.create({ ...payload, password: form.password });
        toast.success(
          form.phone?.trim()
            ? 'User created. Login link sent to their mobile number.'
            : 'User created successfully',
        );
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

  const handleDelete = async (item: User) => {
    if (!confirm(`Delete user "${item.firstName} ${item.lastName}"?`)) return;
    try {
      await usersApi.delete(item.id);
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
          title="Users"
          subtitle="Manage system users"
          actions={
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add User
            </Button>
          }
        />

        <Card title="All Users">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorBanner error={error} onDismiss={() => setError('')} />
          ) : items.length === 0 ? (
            <p className="text-center text-neutral-500">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Phone Number</th>
                    <th className="pb-3 pr-4 font-medium">Role</th>
                    <th className="pb-3 pr-4 font-medium">Branch</th>
                    <th className="pb-3 pr-4 font-medium">Department / Location</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4 font-medium text-black">
                        {item.firstName} {item.lastName}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">{getUserDisplayEmail(item)}</td>
                      <td className="py-3 pr-4 text-neutral-600">{getUserDisplayPhone(item)}</td>
                      <td className="py-3 pr-4"><Badge status={item.role} /></td>
                      <td className="py-3 pr-4 text-neutral-600">{item.branch?.name || '-'}</td>
                      <td className="py-3 pr-4 text-neutral-600">
                        {item.role === 'OFFICE_BOY'
                          ? item.officeLocation?.name || '-'
                          : item.department?.name || '-'}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">{(item as UserWithDate).createdAt ? formatDate((item as UserWithDate).createdAt!) : '-'}</td>
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
          title="View User"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={modal.close}>Close</Button>
              <Button onClick={switchToEditFromView}>Edit</Button>
            </div>
          }
        >
          {modal.selected && (
            <DetailView>
              <DetailField label="First Name" value={modal.selected.firstName} />
              <DetailField label="Last Name" value={modal.selected.lastName} />
              <DetailField label="Email" value={getUserDisplayEmail(modal.selected)} />
              <DetailField label="Phone Number" value={getUserDisplayPhone(modal.selected)} />
              <DetailField label="Role" value={<Badge status={modal.selected.role} />} />
              {modal.selected.role === 'OFFICE_BOY' && (
                <>
                  <DetailField label="Employee ID" value={modal.selected.employeeId} />
                  <DetailField label="Office Location" value={modal.selected.officeLocation?.name} />
                  <DetailField
                    label="Joining Date"
                    value={modal.selected.joiningDate ? formatDate(modal.selected.joiningDate) : '-'}
                  />
                  <DetailField
                    label="Leaving Date"
                    value={modal.selected.leavingDate ? formatDate(modal.selected.leavingDate) : '-'}
                  />
                  <DetailField label="Address" value={modal.selected.address || '-'} />
                </>
              )}
              <DetailField label="Branch" value={modal.selected.branch?.name} />
              {modal.selected.role !== 'OFFICE_BOY' && (
                <DetailField label="Department" value={modal.selected.department?.name} />
              )}
              <DetailField
                label="Created At"
                value={
                  (modal.selected as UserWithDate).createdAt
                    ? formatDate((modal.selected as UserWithDate).createdAt!)
                    : '-'
                }
              />
            </DetailView>
          )}
        </Modal>

        <Modal
          open={modal.isCreate || modal.isEdit}
          onClose={modal.close}
          title={modal.isEdit ? 'Edit User' : 'Add User'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <Input
              label={isOfficeBoy ? 'Email (optional)' : 'Email'}
              placeholder="Enter email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required={!isOfficeBoy}
            />
            <Input
              label="Mobile Number"
              placeholder="Enter mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required={isOfficeBoy}
            />
            <Input
              label={modal.isEdit ? 'New Password (optional)' : 'Password'}
              placeholder="Enter password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!modal.isEdit}
            />
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              options={roleOptions}
            />
            {branches.length > 0 && (
              <Select
                label="Branch"
                value={form.branchId}
                disabled={!isSuperAdmin(currentUser?.role) && !!currentUser?.branchId}
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
                required={isOfficeBoy}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
            )}
            {!isOfficeBoy && departments.length > 0 && (
              <Select
                label="Department"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
              />
            )}
            {isOfficeBoy && (
              <>
                {form.branchId ? (
                  locationOptions.length > 0 ? (
                    <Select
                      label="Office Location"
                      value={form.officeLocationId}
                      onChange={(e) => setForm({ ...form, officeLocationId: e.target.value })}
                      required
                      placeholder="Select office location"
                      options={locationOptions}
                    />
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      No active office location for this branch. Create one under{' '}
                      <strong>Office Locations</strong> first.
                    </div>
                  )
                ) : (
                  <p className="text-sm text-neutral-500">Select a branch to choose office location.</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Joining Date"
                    type="date"
                    value={form.joiningDate}
                    onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  />
                  <Input
                    label="Leaving Date"
                    type="date"
                    value={form.leavingDate}
                    onChange={(e) => setForm({ ...form, leavingDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-black">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    placeholder="Enter full address"
                    className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black shadow-sm transition-colors focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  />
                </div>
              </>
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
