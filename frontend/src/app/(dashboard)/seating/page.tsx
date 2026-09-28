'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { seatingApi, branchesApi, SeatingRecord, Branch } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

type SeatingWithMeta = SeatingRecord & { createdAt?: string };

// Predefined floors and their zones
const FLOOR_ZONE_MAP: Record<string, string[]> = {
  'Ground Floor': ['Zone 1', 'Zone 2', 'Zone 3', 'Reception', 'Lobby'],
  '1st Floor': ['Zone 1', 'Zone 2', 'Zone 3', 'Conference Room A', 'Conference Room B'],
  '2nd Floor': ['Zone 1', 'Zone 2', 'Zone 3', 'Meeting Room', 'Cabin Area'],
  '3rd Floor': ['Zone 1', 'Zone 2', 'Zone 3', 'Training Room', 'Cafeteria'],
  '4th Floor': ['Zone 1', 'Zone 2', 'Zone 3'],
  '5th Floor': ['Zone 1', 'Zone 2', 'Zone 3'],
  'Basement': ['Zone 1', 'Zone 2', 'Parking', 'Storage'],
  'Terrace': ['Open Area', 'Pantry', 'Recreation'],
};

const FLOOR_OPTIONS = Object.keys(FLOOR_ZONE_MAP).map((f) => ({ value: f, label: f }));

export default function SeatingPage() {
  const [items, setItems] = useState<SeatingRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<SeatingRecord>();
  const [form, setForm] = useState({
    branchId: '',
    floor: '',
    zone: '',
    totalSeats: '',
    occupiedSeats: '',
    recordDate: '',
    notes: '',
  });

  // Derive zone options based on selected floor
  const zoneOptions = useMemo(() => {
    if (!form.floor) return [];
    const zones = FLOOR_ZONE_MAP[form.floor] || ['Zone 1', 'Zone 2', 'Zone 3'];
    return zones.map((z) => ({ value: z, label: z }));
  }, [form.floor]);

  const loadData = () => {
    setLoading(true);
    Promise.all([seatingApi.list(), branchesApi.list()])
      .then(([records, brs]) => {
        setItems(records);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load seating records';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () =>
    setForm({ branchId: '', floor: '', zone: '', totalSeats: '', occupiedSeats: '', recordDate: '', notes: '' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: SeatingRecord) => {
    setForm({
      branchId: item.branchId || '',
      floor: item.floor,
      zone: item.zone || '',
      totalSeats: String(item.totalSeats),
      occupiedSeats: String(item.occupiedSeats),
      recordDate: item.recordDate.split('T')[0],
      notes: '',
    });
    modal.openEdit(item);
  };

  const switchToEditFromView = () => {
    if (modal.selected) openEdit(modal.selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!modal.isEdit && !form.branchId) {
        toast.error('Please select a branch');
        setSubmitting(false);
        return;
      }
      if (!form.floor) {
        toast.error('Please select a floor');
        setSubmitting(false);
        return;
      }

      const payload = {
        floor: form.floor,
        zone: form.zone || undefined,
        totalSeats: Number(form.totalSeats),
        occupiedSeats: Number(form.occupiedSeats),
        recordDate: form.recordDate,
        notes: form.notes || undefined,
      };
      if (modal.isEdit && modal.selected) {
        await seatingApi.update(modal.selected.id, payload);
        toast.success('Seating record updated successfully');
      } else {
        await seatingApi.create({ ...payload, branchId: form.branchId });
        toast.success('Seating record created successfully');
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

  const handleDelete = async (item: SeatingRecord) => {
    if (!confirm(`Delete seating record for "${item.floor}${item.zone ? ' – ' + item.zone : ''}"?`)) return;
    try {
      await seatingApi.delete(item.id);
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
        title="Daily Seating"
        subtitle="Track daily seating occupancy by floor and zone"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        }
      />

      <Card title="Seating Records">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No seating records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Floor</th>
                  <th className="pb-3 pr-4 font-medium">Zone</th>
                  <th className="pb-3 pr-4 font-medium">Total Seats</th>
                  <th className="pb-3 pr-4 font-medium">Occupied</th>
                  <th className="pb-3 pr-4 font-medium">Available</th>
                  <th className="pb-3 pr-4 font-medium">Branch</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.floor}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.zone || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.totalSeats}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.occupiedSeats}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.totalSeats - item.occupiedSeats}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.branch?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{(item as SeatingWithMeta).recordDate ? formatDate((item as SeatingWithMeta).recordDate!) : '-'}</td>
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
        title="View Seating Record"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={switchToEditFromView}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Floor" value={modal.selected.floor} />
            <DetailField label="Zone" value={modal.selected.zone || '-'} />
            <DetailField label="Total Seats" value={modal.selected.totalSeats} />
            <DetailField label="Occupied Seats" value={modal.selected.occupiedSeats} />
            <DetailField
              label="Available Seats"
              value={modal.selected.totalSeats - modal.selected.occupiedSeats}
            />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField label="Date" value={modal.selected.recordDate ? formatDate(modal.selected.recordDate) : '-'} />
          </DetailView>
        )}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit Seating Record' : 'Add Seating Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!modal.isEdit && branches.length > 0 && (
            <Select
              label="Branch"
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              required
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
          )}

          {/* Floor Selector */}
          <Select
            label="Floor"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: e.target.value, zone: '' })}
            required
            options={FLOOR_OPTIONS}
          />

          {/* Zone Selector — only shown after floor is selected */}
          {form.floor && zoneOptions.length > 0 && (
            <div>
              <Select
                label="Zone / Room"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                options={[{ value: '', label: 'Select zone...' }, ...zoneOptions]}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Zones for <strong>{form.floor}</strong>: {zoneOptions.map((z) => z.label).join(', ')}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Seats"
              placeholder="Enter total seats"
              type="number"
              min="0"
              value={form.totalSeats}
              onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
              required
            />
            <Input
              label="Occupied Seats"
              placeholder="Enter occupied seats"
              type="number"
              min="0"
              value={form.occupiedSeats}
              onChange={(e) => setForm({ ...form, occupiedSeats: e.target.value })}
              required
            />
          </div>

          <Input
            label="Date"
            type="date"
            value={form.recordDate}
            onChange={(e) => setForm({ ...form, recordDate: e.target.value })}
            required
          />

          <Input
            label="Notes (Optional)"
            placeholder="Enter notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
