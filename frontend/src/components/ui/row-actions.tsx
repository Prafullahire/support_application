'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from './button';

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function RowActions({
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}: RowActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {showView && onView && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onView}
          title="View"
          className="h-8 w-8 p-0 text-brand-black hover:bg-surface-muted"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {showEdit && onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          title="Edit"
          className="h-8 w-8 p-0 text-brand-red hover:bg-brand-red/10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {showDelete && onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          title="Delete"
          className="h-8 w-8 p-0 text-primary-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
