'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { joiningKitApi } from '@/lib/api';
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

interface KitItem {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  itemName?: string;
}

interface StockItem {
  id: string;
  itemId: string;
  quantity: number;
  item?: KitItem;
}

const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export default function JoiningKitPage() {
  const [items, setItems] = useState<KitItem[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const itemModal = useRecordModal<KitItem>();
  const [itemForm, setItemForm] = useState({ name: '', description: '', isActive: 'true' });
  const [issueForm, setIssueForm] = useState({ itemId: '', quantity: '1', employeeName: '' });

  const loadData = () => {
    setLoading(true);
    Promise.all([joiningKitApi.items(), joiningKitApi.stock()])
      .then(([kitItems, stockData]) => {
        setItems(kitItems as KitItem[]);
        setStock(stockData as StockItem[]);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load joining kit data';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditItem = (item: KitItem) => {
    setItemForm({
      name: item.name,
      description: item.description || '',
      isActive: item.isActive !== false ? 'true' : 'false',
    });
    itemModal.openEdit(item);
  };

  const handleItemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!itemModal.selected) return;
    setSubmitting(true);
    try {
      await joiningKitApi.updateItem(itemModal.selected.id, {
        name: itemForm.name,
        description: itemForm.description || undefined,
        isActive: itemForm.isActive === 'true',
      });
      itemModal.close();
      loadData();
      toast.success('Kit item updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssue = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await joiningKitApi.issue({
        itemId: issueForm.itemId,
        quantity: Number(issueForm.quantity),
        employeeName: issueForm.employeeName,
      });
      setShowIssueForm(false);
      setIssueForm({ itemId: '', quantity: '1', employeeName: '' });
      loadData();
      toast.success('Kit item issued successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to issue kit item';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const kitItems: KitItem[] = items.map((item) => ({
    ...item,
    itemName: item.name,
  }));
  const kitPagination = usePagination(kitItems);
  const stockPagination = usePagination(stock);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Joining Kit"
        subtitle="Manage joining kit items and stock"
        actions={
          <Button onClick={() => setShowIssueForm(true)} className="gap-2">
            <PackagePlus className="h-4 w-4" /> Issue Item
          </Button>
        }
      />

      <Card title="Kit Items">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : kitItems.length === 0 ? (
          <p className="text-center text-neutral-500">No kit items found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Description</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kitPagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.name}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.description || '-'}</td>
                    <td className="py-3 pr-4">
                      <Badge status={item.isActive !== false ? 'ACTIVE' : 'CANCELLED'} />
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(item.createdAt)}</td>
                    <td className="py-3">
                      <RowActions
                        onView={() => itemModal.openView(item)}
                        onEdit={() => openEditItem(item)}
                        showDelete={false}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={kitPagination.page}
              totalPages={kitPagination.totalPages}
              totalItems={kitPagination.totalItems}
              pageSize={kitPagination.pageSize}
              startIndex={kitPagination.startIndex}
              endIndex={kitPagination.endIndex}
              onPageChange={kitPagination.setPage}
              onPageSizeChange={kitPagination.setPageSize}
            />
          </div>
        )}
      </Card>

      <Card title="Kit Stock">
        {loading ? (
          <LoadingState />
        ) : stock.length === 0 ? (
          <p className="text-center text-neutral-500">No stock records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Item</th>
                  <th className="pb-3 font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stockPagination.paginatedItems.map((s) => (
                  <tr key={s.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{s.item?.name || s.itemId}</td>
                    <td className="py-3 text-neutral-600">{s.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={stockPagination.page}
              totalPages={stockPagination.totalPages}
              totalItems={stockPagination.totalItems}
              pageSize={stockPagination.pageSize}
              startIndex={stockPagination.startIndex}
              endIndex={stockPagination.endIndex}
              onPageChange={stockPagination.setPage}
              onPageSizeChange={stockPagination.setPageSize}
            />
          </div>
        )}
      </Card>

      <Modal
        open={itemModal.isView}
        onClose={itemModal.close}
        title="View Kit Item"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={itemModal.close}>Close</Button>
            <Button onClick={itemModal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {itemModal.selected && (
          <DetailView>
            <DetailField label="Name" value={itemModal.selected.name} />
            <DetailField label="Description" value={itemModal.selected.description} />
            <DetailField
              label="Status"
              value={<Badge status={itemModal.selected.isActive !== false ? 'ACTIVE' : 'CANCELLED'} />}
            />
            <DetailField
              label="Created At"
              value={
                itemModal.selected.createdAt ? formatDate(itemModal.selected.createdAt) : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal open={itemModal.isEdit} onClose={itemModal.close} title="Edit Kit Item">
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <Input
            label="Name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
          />
          <Select
            label="Status"
            value={itemForm.isActive}
            onChange={(e) => setItemForm({ ...itemForm, isActive: e.target.value })}
            options={STATUS_OPTIONS}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={itemModal.close}>Cancel</Button>
            <Button type="submit" loading={submitting}>Update</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showIssueForm} onClose={() => setShowIssueForm(false)} title="Issue Kit Item">
        <form onSubmit={handleIssue} className="space-y-4">
          <Select
            label="Item"
            value={issueForm.itemId}
            onChange={(e) => setIssueForm({ ...issueForm, itemId: e.target.value })}
            options={items.map((i) => ({ value: i.id, label: i.name }))}
          />
          <Input
            label="Employee Name"
            value={issueForm.employeeName}
            onChange={(e) => setIssueForm({ ...issueForm, employeeName: e.target.value })}
            required
          />
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={issueForm.quantity}
            onChange={(e) => setIssueForm({ ...issueForm, quantity: e.target.value })}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowIssueForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Issue</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
