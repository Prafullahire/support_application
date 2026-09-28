'use client';

import { PageHeader } from '@/components/layout/page-header';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import {
  expensesApi,
  entitiesApi,
  branchesApi,
  Expense,
  ExpenseCategory,
  ExpenseSummary,
  Entity,
  Branch,
  ExpenseFilters,
} from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { RowActions } from '@/components/ui/row-actions';
import { DetailField, DetailView } from '@/components/ui/detail-view';
import { useRecordModal } from '@/hooks/use-record-modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import FileUpload from '@/components/ui/file-upload';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';

const SORT_OPTIONS = [
  { value: 'expenseDate', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Created At' },
];

const ORDER_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export default function ExpensesPage() {
  const [items, setItems] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modal = useRecordModal<Expense>();
  const isInitialLoad = useRef(true);

  const [filters, setFilters] = useState<ExpenseFilters>({
    sortBy: 'expenseDate',
    sortOrder: 'desc',
  });

  const [form, setForm] = useState({
    title: '',
    amount: '',
    expenseDate: '',
    categoryId: '',
    entityId: '',
    branchId: '',
    description: '',
    invoiceUrl: '',
  });

  const loadData = useCallback(() => {
    if (isInitialLoad.current) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    Promise.all([
      expensesApi.list(filters),
      expensesApi.summary({ startDate: filters.startDate, endDate: filters.endDate }),
      expensesApi.categories(),
      entitiesApi.list(),
      branchesApi.list(),
    ])
      .then(([expenses, sum, cats, ents, brs]) => {
        setItems(expenses);
        setSummary(sum);
        setCategories(cats);
        setEntities(ents);
        setBranches(brs);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load expenses';
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
        isInitialLoad.current = false;
      });
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () =>
    setForm({ title: '', amount: '', expenseDate: '', categoryId: '', entityId: '', branchId: '', description: '', invoiceUrl: '' });

  const openCreate = () => {
    resetForm();
    modal.openCreate();
  };

  const openEdit = (item: Expense) => {
    setForm({
      title: item.title,
      amount: String(item.amount),
      expenseDate: item.expenseDate.split('T')[0],
      categoryId: item.categoryId || '',
      entityId: item.entityId || '',
      branchId: item.branchId || '',
      description: (item as Expense & { description?: string }).description || '',
      invoiceUrl: item.invoiceUrl || '',
    });
    modal.openEdit(item);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        categoryId: form.categoryId || undefined,
        entityId: form.entityId || undefined,
        branchId: form.branchId || undefined,
        description: form.description || undefined,
        invoiceUrl: form.invoiceUrl || undefined,
      };
      if (modal.isEdit && modal.selected) {
        await expensesApi.update(modal.selected.id, payload);
        toast.success('Expense updated successfully');
      } else {
        await expensesApi.create(payload);
        toast.success('Expense created successfully');
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

  const handleDelete = async (item: Expense) => {
    if (!confirm(`Delete expense "${item.title}"?`)) return;
    try {
      await expensesApi.delete(item.id);
      toast.success('Deleted successfully');
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      toast.error(message);
    }
  };

  const applyFilter = (key: keyof ExpenseFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'expenseDate', sortOrder: 'desc' });
  };

  const filteredBranches =
    filters.entityId && summary?.entityWise
      ? summary.entityWise.find((e) => e.entityId === filters.entityId)?.branches?.map((b) => ({
          id: b.branchId,
          name: b.branchName,
        })) || branches
      : branches;

  const entityPagination = usePagination(summary?.entityWise ?? []);
  const pagination = usePagination(items);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Entity-wise and branch-wise expense management"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-neutral-500">Total Expenses</p>
            <p className="text-2xl font-bold text-black">{formatCurrency(summary.grandTotal)}</p>
            <p className="text-xs text-neutral-400">{summary.totalCount} records</p>
          </Card>
          {summary.entityWise.slice(0, 3).map((entity) => (
            <Card key={entity.entityId}>
              <p className="text-sm text-neutral-500 truncate">{entity.entityName}</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(entity.total)}</p>
              <p className="text-xs text-neutral-400">{entity.count} expenses</p>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card title="Filters & Sorting">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Entity"
            value={filters.entityId || ''}
            onChange={(e) => applyFilter('entityId', e.target.value)}
            options={entities.map((e) => ({ value: e.id, label: e.name }))}
          />
          <Select
            label="Branch"
            value={filters.branchId || ''}
            onChange={(e) => applyFilter('branchId', e.target.value)}
            options={filteredBranches.map((b) => ({ value: b.id, label: b.name }))}
          />
          <Input
            label="From Date"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => applyFilter('startDate', e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => applyFilter('endDate', e.target.value)}
          />
          <Select
            label="Sort By"
            value={filters.sortBy || 'expenseDate'}
            onChange={(e) => applyFilter('sortBy', e.target.value)}
            options={SORT_OPTIONS}
          />
          <Select
            label="Order"
            value={filters.sortOrder || 'desc'}
            onChange={(e) => applyFilter('sortOrder', e.target.value)}
            options={ORDER_OPTIONS}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={clearFilters} className="gap-2">
            <Filter className="h-4 w-4" /> Clear Filters
          </Button>
        </div>
      </Card>

      {/* Entity-wise Summary Table */}
      {summary && summary.entityWise.length > 0 && (
        <Card title="Entity-wise Summary">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Entity</th>
                  <th className="pb-3 pr-4 font-medium">Total Amount</th>
                  <th className="pb-3 pr-4 font-medium">Count</th>
                  <th className="pb-3 font-medium">Branches</th>
                </tr>
              </thead>
              <tbody>
                {entityPagination.paginatedItems.map((entity) => (
                  <tr key={entity.entityId} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{entity.entityName}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatCurrency(entity.total)}</td>
                    <td className="py-3 pr-4 text-neutral-600">{entity.count}</td>
                    <td className="py-3 text-neutral-600">
                      {entity.branches?.map((b) => `${b.branchName} (${formatCurrency(b.total)})`).join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={entityPagination.page}
              totalPages={entityPagination.totalPages}
              totalItems={entityPagination.totalItems}
              pageSize={entityPagination.pageSize}
              startIndex={entityPagination.startIndex}
              endIndex={entityPagination.endIndex}
              onPageChange={entityPagination.setPage}
              onPageSizeChange={entityPagination.setPageSize}
            />
          </div>
        </Card>
      )}

      {/* Branch-wise Summary */}
      {summary && summary.branchWise.length > 0 && (
        <Card title="Branch-wise Summary">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.branchWise.map((branch) => (
              <div key={branch.branchId} className="rounded-lg border border-neutral-200 p-4">
                <p className="font-medium text-black">{branch.branchName}</p>
                <p className="text-lg font-bold text-primary-600">{formatCurrency(branch.total)}</p>
                <p className="text-xs text-neutral-400">{branch.count} expenses</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Expense Records">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner error={error} onDismiss={() => setError('')} />
        ) : items.length === 0 ? (
          <p className="text-center text-neutral-500">No expenses found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500">
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium">Entity</th>
                  <th className="pb-3 pr-4 font-medium">Branch</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagination.paginatedItems.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4 font-medium text-black">{item.title}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.entity?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.branch?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatCurrency(item.amount)}</td>
                    <td className="py-3 pr-4 text-neutral-600">{item.category?.name || '-'}</td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(item.expenseDate)}</td>
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
        title="View Expense"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={modal.close}>Close</Button>
            <Button onClick={modal.switchToEdit}>Edit</Button>
          </div>
        }
      >
        {modal.selected && (
          <DetailView>
            <DetailField label="Title" value={modal.selected.title} />
            <DetailField label="Amount" value={formatCurrency(modal.selected.amount)} />
            <DetailField label="Entity" value={modal.selected.entity?.name} />
            <DetailField label="Branch" value={modal.selected.branch?.name} />
            <DetailField label="Category" value={modal.selected.category?.name} />
            <DetailField label="Vendor" value={modal.selected.vendor?.name} />
            <DetailField label="Date" value={formatDate(modal.selected.expenseDate)} />
            <DetailField label="Invoice" value={modal.selected.invoiceUrl ? <a href={modal.selected.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">View Invoice</a> : '-'} />
            <DetailField
              label="Created By"
              value={
                modal.selected.createdBy
                  ? `${modal.selected.createdBy.firstName} ${modal.selected.createdBy.lastName}`
                  : '-'
              }
            />
          </DetailView>
        )}
      </Modal>

      <Modal
        open={modal.isCreate || modal.isEdit}
        onClose={modal.close}
        title={modal.isEdit ? 'Edit Expense' : 'Add Expense'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" placeholder="Enter title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              placeholder="Enter amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <Input
              label="Date"
              type="date"
              value={form.expenseDate}
              onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
              required
            />
          </div>
          <Select
            label="Entity"
            value={form.entityId}
            onChange={(e) => setForm({ ...form, entityId: e.target.value, branchId: '' })}
            options={entities.map((e) => ({ value: e.id, label: e.name }))}
          />
          <Select
            label="Branch"
            value={form.branchId}
            onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            options={branches.map((b) => ({ value: b.id, label: b.name }))}
          />
          {categories.length > 0 && (
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          )}
          <Input
            label="Description"
            placeholder="Enter description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <FileUpload
            module="expenses"
            recordId={modal.selected?.id || 'new'}
            attachments={form.invoiceUrl ? [{ id: '1', fileName: 'Invoice', fileUrl: form.invoiceUrl, mimeType: 'application/pdf', fileSize: 0 } as any] : []}
            onUpload={(att) => setForm({ ...form, invoiceUrl: att.fileUrl })}
            onDelete={() => setForm({ ...form, invoiceUrl: '' })}
            label="Invoice Attachment"
            multiple={false}
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
