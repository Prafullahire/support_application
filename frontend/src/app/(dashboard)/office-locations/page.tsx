'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminGuard } from '@/components/auth-guard';
import { officeLocationsApi, branchesApi, OfficeLocation, Branch } from '@/lib/api';
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
import { getCurrentPosition } from '@/lib/geolocation';
import { MapPin } from 'lucide-react';

export default function OfficeLocationsPage() {
  const [items, setItems] = useState<OfficeLocation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const modal = useRecordModal<OfficeLocation>();
  const [form, setForm] = useState({
    name: '',
    branchId: '',
    latitude: '',
    longitude: '',
    allowedRadiusMeters: '100',
    isActive: 'true',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([officeLocationsApi.list(), branchesApi.list()])
      .then(([locations, brs]) => {
        setItems(locations);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load locations';
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
      branchId: '',
      latitude: '',
      longitude: '',
      allowedRadiusMeters: '100',
      isActive: 'true',
    });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: OfficeLocation) => {
    setForm({
      name: item.name,
      branchId: item.branchId,
      latitude: String(item.latitude),
      longitude: String(item.longitude),
      allowedRadiusMeters: String(item.allowedRadiusMeters),
      isActive: item.isActive ? 'true' : 'false',
    });
    modal.openEdit(item);
  };

  const useMyLocation = async () => {
    setDetectingLocation(true);
    try {
      const position = await getCurrentPosition();
      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6),
        allowedRadiusMeters: prev.allowedRadiusMeters || '2000',
      }));
      toast.success('Coordinates filled from your current location');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not get location');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        branchId: form.branchId,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        allowedRadiusMeters: parseInt(form.allowedRadiusMeters, 10),
        isActive: form.isActive === 'true',
      };
      if (modal.isEdit && modal.selected) {
        await officeLocationsApi.update(modal.selected.id, payload);
        toast.success('Location updated');
      } else {
        await officeLocationsApi.create(payload);
        toast.success('Location created');
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

  const handleDelete = async (item: OfficeLocation) => {
    if (!confirm(`Delete location "${item.name}"?`)) return;
    try {
      await officeLocationsApi.delete(item.id);
      toast.success('Location deleted');
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const pagination = usePagination(items);

  if (loading) return <LoadingState message="Loading office locations..." />;

  return (
    <AdminGuard>
      <div className="space-y-6">
        <PageHeader
          title="Office Locations"
          subtitle="Configure GPS office locations and allowed radius"
          actions={
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Location
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
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Latitude</th>
                <th className="px-4 py-3 font-medium">Longitude</th>
                <th className="px-4 py-3 font-medium">Radius (m)</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedItems.map((item) => (
                <tr key={item.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">{item.branch?.name || '—'}</td>
                  <td className="px-4 py-3">{item.latitude}</td>
                  <td className="px-4 py-3">{item.longitude}</td>
                  <td className="px-4 py-3">{item.allowedRadiusMeters}</td>
                  <td className="px-4 py-3">
                    <Badge status={item.isActive ? 'ACTIVE' : 'CLOSED'} />
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
            <p className="p-6 text-center text-sm text-neutral-500">No office locations yet.</p>
          )}
        </div>
      </Card>

      <Modal
        open={modal.isOpen}
        onClose={modal.close}
        title={modal.isView ? 'Location Details' : modal.isEdit ? 'Edit Location' : 'Add Location'}
      >
        {modal.isView && modal.selected ? (
          <DetailView>
            <DetailField label="Name" value={modal.selected.name} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField label="Latitude" value={String(modal.selected.latitude)} />
            <DetailField label="Longitude" value={String(modal.selected.longitude)} />
            <DetailField label="Radius" value={`${modal.selected.allowedRadiusMeters} meters`} />
            <DetailField label="Status" value={modal.selected.isActive ? 'Active' : 'Inactive'} />
          </DetailView>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Location Name"
              placeholder="Enter location name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Select
              label="Branch"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              required
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Latitude"
                placeholder="Enter latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                required
              />
              <Input
                label="Longitude"
                placeholder="Enter longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                required
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              loading={detectingLocation}
              onClick={useMyLocation}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Use my current location
            </Button>
            <Input
              label="Allowed Radius (meters)"
              placeholder="Enter radius"
              type="number"
              min={10}
              value={form.allowedRadiusMeters}
              onChange={(e) => setForm({ ...form, allowedRadiusMeters: e.target.value })}
              required
            />
            <p className="text-xs text-neutral-500">
              For testing, use 2000 m (2 km). Production offices often use 100–500 m.
            </p>
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
              <Button type="button" variant="outline" onClick={modal.close}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {modal.isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      </div>
    </AdminGuard>
  );
}
