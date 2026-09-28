'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { Plus, PackageMinus } from 'lucide-react';
import { brochuresApi, BrochureStock } from '@/lib/api';
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

type BrochureWithDate = BrochureStock & { createdAt?: string; description?: string };

export default function BrochuresPage() {
  const [items, setItems] = useState<BrochureStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<BrochureStock>();
  const [stockForm, setStockForm] = useState({ name: '', quantity: '', minStock: '' });
  const [issueForm, setIssueForm] = useState({ stockId: '', quantity: '1', issuedTo: '' });

  const loadData = () => {
    setLoading(true);
    brochuresApi
      .stock()
      .then(setItems)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load brochure stock';
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetStockForm = () => setStockForm({ name: '', quantity: '', minStock: '' });

  const openCreateStock = () => {
    resetStockForm();
    modal.openCreate();
  };

  const openEditStock = (item: BrochureStock) => {
    setStockForm({
      name: item.name,
      quantity: String(item.quantity),
      minStock: String(item.minStock),
    });
    modal.openEdit(item);
  };

  const handleStockSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: stockForm.name,
        quantity: Number(stockForm.quantity),
        minStock: Number(stockForm.minStock),
      };
      if (modal.isEdit && modal.selected) {
        await brochuresApi.updateStock(modal.selected.id, payload);
        toast.success('Brochure stock updated successfully');
      } else {
        await brochuresApi.createStock(payload);
        toast.success('Brochure stock created successfully');
      }
      modal.close();
      resetStockForm();
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStock = async (item: BrochureStock) => {
    if (!confirm(`Delete brochure stock "${item.name}"?`)) return;
    try {
      await brochuresApi.deleteStock(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const handleIssue = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await brochuresApi.issue({
        stockId: issueForm.stockId,
        quantity: Number(issueForm.quantity),
        issuedTo: issueForm.issuedTo,
      });
      setShowIssueForm(false);
      setIssueForm({ stockId: '', quantity: '1', issuedTo: '' });
      loadData();
      toast.success('Brochure issued successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to issue brochure';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const pagination = usePagination(items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brochures"
        subtitle="Manage brochure stock and distribution"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowIssueForm(true)} className="gap-2">
              <PackageMinus className="h-4 w-4" /> Issue
            </Button>
            <Button onClick={openCreateStock} className="gap-2">
              <Plus className="h-4 w-4" /> Add Stock
            </Button>
          </div>
        }
      />

      <Card title="Brochure Stock">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No brochure stock found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Quantity</th>
                  <th className="pb-3 pr-4 font-medium">Min Stock</th>
                  <th className="pb-3 pr-4 font-medium">Branch</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.name}</td>
                    <td
                      className={`py-3 pr-4 ${item.quantity <= item.minStock ? 'text-red-600 font-medium' : 'text-neutral-600'}`}
                    >
                      {item.quantity}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{item.minStock}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.branch?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{(item as BrochureWithDate).createdAt ? formatDate((item as BrochureWithDate).createdAt!) : '-'}</td>
                    <td className="py-3">
                      <RowActions
                        onView={() => modal.openView(item)}
                        onEdit={() => openEditStock(item)}
                        onDelete={() => handleDeleteStock(item)}
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
        title="View Brochure Stock"
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
            <DetailField label="Quantity" value={modal.selected.quantity} />
            <DetailField label="Min Stock" value={modal.selected.minStock} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField
              label="Created At"
              value={
                (modal.selected as BrochureWithDate).createdAt
                  ? formatDate((modal.selected as BrochureWithDate).createdAt!)
                  : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit Brochure Stock' : 'Add Brochure Stock'}
      >
        <form onSubmit={handleStockSubmit} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter name"
            value={stockForm.name}
            onChange={(e) => setStockForm({ ...stockForm, name: e.target.value })}
            required
          />
          <Input
            label="Quantity"
            placeholder="Enter quantity"
            type="number"
            value={stockForm.quantity}
            onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
            required
          />
          <Input
            label="Min Stock"
            placeholder="Enter minimum stock"
            type="number"
            value={stockForm.minStock}
            onChange={(e) => setStockForm({ ...stockForm, minStock: e.target.value })}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={modal.close}>Cancel</Button>
            <Button type="submit" loading={submitting}>{modal.isEdit ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showIssueForm} onClose={() => setShowIssueForm(false)} title="Issue Brochure">
        <form onSubmit={handleIssue} className="space-y-4">
          <Select
            label="Brochure"
            value={issueForm.stockId}
            onChange={(e) => setIssueForm({ ...issueForm, stockId: e.target.value })}
            options={items.map((i) => ({ value: i.id, label: i.name }))}
          />
          <Input
            label="Issued To"
            value={issueForm.issuedTo}
            onChange={(e) => setIssueForm({ ...issueForm, issuedTo: e.target.value })}
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
