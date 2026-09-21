'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

function getVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div
      className={cn(
        'mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-xs text-text-muted">
        Showing <span className="font-medium text-brand-black">{startIndex}</span>–
        <span className="font-medium text-brand-black">{endIndex}</span> of{' '}
        <span className="font-medium text-brand-black">{totalItems}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange && (
          <label className="flex items-center gap-1.5 text-xs text-text-muted">
            Rows
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-brand-black focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-brand-black transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {visiblePages.map((pageNumber, index) => {
              const previous = visiblePages[index - 1];
              const showEllipsis = previous !== undefined && pageNumber - previous > 1;

              return (
                <span key={pageNumber} className="flex items-center gap-1">
                  {showEllipsis && <span className="px-1 text-xs text-text-muted">…</span>}
                  <button
                    type="button"
                    onClick={() => onPageChange(pageNumber)}
                    className={cn(
                      'min-w-8 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                      pageNumber === page
                        ? 'bg-brand-black text-white'
                        : 'border border-gray-200 text-brand-black hover:bg-surface-muted',
                    )}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}
          </div>

          <span className="px-2 text-xs text-text-muted sm:hidden">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-brand-black transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
