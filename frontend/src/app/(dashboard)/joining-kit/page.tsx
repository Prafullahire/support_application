'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useEffect, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { joiningKitApi, branchesApi, Branch } from '@/lib/api';
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

interface KitIssue {
  id: string;
  issueNumber: string;
  employeeId: string;
  employeeName: string;
  location: string;
  branchId: string;
  joiningDate: string;
  notes?: string;
  isReturned: boolean;
  returnedAt?: string;
  createdAt: string;
  branch?: { id: string; name: string };
}

const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export default function JoiningKitPage() {
  const [items, setItems] = useState<KitItem[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [issues, setIssues] = useState<KitIssue[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const itemModal = useRecordModal<KitItem>();
  const [itemForm, setItemForm] = useState({ name: '', description: '', isActive: 'true' });
  const [issueForm, setIssueForm] = useState({
    itemId: '',
    quantity: '1',
    employeeId: '',
    employeeName: '',
    location: '',
    branchId: '',
    joiningDate: '',
    notes: '',
  });
  const [returnForm, setReturnForm] = useState({ id: '', notes: '' });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      joiningKitApi.items(),
      joiningKitApi.stock(),
      joiningKitApi.issues(),
      branchesApi.list()
    ])
      .then(([kitItems, stockData, issuesData, branchesData]) => {
        setItems(kitItems as KitItem[]);
        setStock(stockData as StockItem[]);
        setIssues(issuesData as KitIssue[]);
        setBranches(branchesData as Branch[]);
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
        employeeId: issueForm.employeeId,
        employeeName: issueForm.employeeName,
        location: issueForm.location,
        branchId: issueForm.branchId,
        joiningDate: issueForm.joiningDate,
        notes: issueForm.notes || undefined,
        items: [{
          itemId: issueForm.itemId,
          quantity: Number(issueForm.quantity),
        }]
      });
      setShowIssueForm(false);
      setIssueForm({ itemId: '', quantity: '1', employeeId: '', employeeName: '', location: '', branchId: '', joiningDate: '', notes: '' });
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

  const handleReturn = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await joiningKitApi.returnKit(returnForm.id, { notes: returnForm.notes });
      setShowReturnForm(false);
      setReturnForm({ id: '', notes: '' });
      loadData();
      toast.success('Kit returned successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to return kit';
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
  const issuePagination = usePagination(issues);

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

      <Card title="Issued Kits">
        {loading ? (
          <LoadingState />
        ) : issues.length === 0 ? (
          <p className="text-center text-neutral-500">No issued kits found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Issue #</th>
                  <th className="pb-3 pr-4 font-medium">Employee</th>
                  <th className="pb-3 pr-4 font-medium">Branch/Location</th>
                  <th className="pb-3 pr-4 font-medium">Joining Date</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuePagination.paginatedItems.map((i) => (
                  <tr key={i.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 text-black font-medium">{i.issueNumber}</td>
                    <td className="py-3 pr-4 text-neutral-600">{i.employeeName} ({i.employeeId})</td>
                    <td className="py-3 pr-4 text-neutral-600">{i.branch?.name} - {i.location}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(i.joiningDate)}</td>
                    <td className="py-3 pr-4">
                      {i.isReturned ? (
                        <Badge status="RETURNED" />
                      ) : (
                        <Badge status="ISSUED" />
                      )}
                    </td>
                    <td className="py-3">
                      {!i.isReturned && (
                        <Button variant="secondary" size="sm" onClick={() => { setReturnForm({ id: i.id, notes: '' }); setShowReturnForm(true); }}>
                          Return
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={issuePagination.page}
              totalPages={issuePagination.totalPages}
              totalItems={issuePagination.totalItems}
              pageSize={issuePagination.pageSize}
              startIndex={issuePagination.startIndex}
              endIndex={issuePagination.endIndex}
              onPageChange={issuePagination.setPage}
              onPageSizeChange={issuePagination.setPageSize}
            />
          </div>
        )}
      </Card>

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
                    <td className="py-3 pr-4 text-neutral-600">{item.createdAt ? formatDate(item.createdAt) : '-'}</td>
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

      <Modal open={showIssueForm} onClose={() => setShowIssueForm(false)} title="Issue Kit Item" size="lg">
        <form onSubmit={handleIssue} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              placeholder="Enter employee ID"
              value={issueForm.employeeId}
              onChange={(e) => setIssueForm({ ...issueForm, employeeId: e.target.value })}
              required
            />
            <Input
              label="Employee Name"
              placeholder="Enter employee name"
              value={issueForm.employeeName}
              onChange={(e) => setIssueForm({ ...issueForm, employeeName: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Branch"
              value={issueForm.branchId}
              onChange={(e) => setIssueForm({ ...issueForm, branchId: e.target.value })}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
            <Input
              label="Location (Desk / Seat)"
              placeholder="Enter location"
              value={issueForm.location}
              onChange={(e) => setIssueForm({ ...issueForm, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Joining Date"
              type="date"
              value={issueForm.joiningDate}
              onChange={(e) => setIssueForm({ ...issueForm, joiningDate: e.target.value })}
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
          </div>

          <Select
            label="Item"
            value={issueForm.itemId}
            onChange={(e) => setIssueForm({ ...issueForm, itemId: e.target.value })}
            options={items.map((i) => ({ value: i.id, label: i.name }))}
          />
          
          <Input
            label="Notes (Optional)"
            placeholder="Enter notes"
            value={issueForm.notes}
            onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowIssueForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Issue Kit</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showReturnForm} onClose={() => setShowReturnForm(false)} title="Return Kit">
        <form onSubmit={handleReturn} className="space-y-4">
          <Input
            label="Return Notes (Optional)"
            value={returnForm.notes}
            onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowReturnForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Confirm Return</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
