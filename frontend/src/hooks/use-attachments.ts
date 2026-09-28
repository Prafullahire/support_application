'use client';

import { useCallback, useEffect, useState } from 'react';
import { Attachment, uploadsApi } from '@/lib/api';
import { toast } from 'sonner';

interface UseAttachmentsOptions {
  module: string;
  recordId: string;
  /** If true, fetches attachments immediately on mount */
  autoFetch?: boolean;
}

interface UseAttachmentsReturn {
  attachments: Attachment[];
  loading: boolean;
  uploading: boolean;
  fetch: () => Promise<void>;
  upload: (file: File) => Promise<Attachment | null>;
  remove: (id: string) => Promise<boolean>;
}

/**
 * Hook to manage Cloudinary-backed attachments for any module record.
 *
 * @example
 * const { attachments, upload, remove, loading } = useAttachments({
 *   module: 'expenses',
 *   recordId: expense.id,
 *   autoFetch: true,
 * });
 */
export function useAttachments({
  module,
  recordId,
  autoFetch = true,
}: UseAttachmentsOptions): UseAttachmentsReturn {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetch = useCallback(async () => {
    if (!recordId || recordId === 'general') return;
    setLoading(true);
    try {
      const data = await uploadsApi.listByRecord(module, recordId);
      setAttachments(data);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  }, [module, recordId]);

  const upload = useCallback(
    async (file: File): Promise<Attachment | null> => {
      setUploading(true);
      try {
        const attachment = await uploadsApi.upload(file, module, recordId);
        setAttachments((prev) => [attachment, ...prev]);
        return attachment;
      } catch (err: any) {
        toast.error(err?.message ?? `Failed to upload "${file.name}"`);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [module, recordId],
  );

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await uploadsApi.delete(id);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete attachment');
      return false;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, recordId]);

  return { attachments, loading, uploading, fetch, upload, remove };
}
