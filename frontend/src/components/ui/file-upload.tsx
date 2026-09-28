'use client';

import { useCallback, useRef, useState } from 'react';
import { Attachment, uploadsApi } from '@/lib/api';
import { toast } from 'sonner';

// ─── File type helpers ────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(mimeType?: string): string {
  if (!mimeType) return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType === 'application/pdf') return '📕';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  return '📄';
}

function isImage(mimeType?: string): boolean {
  return Boolean(mimeType?.startsWith('image/'));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileUploadProps {
  /** Module name passed to the backend (e.g. 'expenses', 'requests', 'amc') */
  module: string;
  /** The record ID this file belongs to */
  recordId: string;
  /** Pre-existing attachments to display */
  attachments?: Attachment[];
  /** Called after a successful upload with the new attachment */
  onUpload?: (attachment: Attachment) => void;
  /** Called after a successful delete with the deleted attachment id */
  onDelete?: (id: string) => void;
  /** Max file size in bytes (default: 20 MB) */
  maxSize?: number;
  /** Allowed MIME types (default: images, PDF, docs, videos) */
  accept?: string;
  /** Label shown above the dropzone */
  label?: string;
  /** Allow multiple file uploads */
  multiple?: boolean;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FileUpload({
  module,
  recordId,
  attachments = [],
  onUpload,
  onDelete,
  maxSize = 20 * 1024 * 1024,
  accept = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,video/*',
  label = 'Attachments',
  multiple = true,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>(attachments);

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      for (const file of Array.from(files)) {
        if (file.size > maxSize) {
          toast.error(`"${file.name}" is too large. Max size is ${formatBytes(maxSize)}.`);
          continue;
        }

        setUploading(true);
        try {
          const attachment = await uploadsApi.upload(file, module, recordId);
          setLocalAttachments((prev) => [attachment, ...prev]);
          onUpload?.(attachment);
          toast.success(`"${file.name}" uploaded successfully`);
        } catch (err: any) {
          toast.error(err?.message ?? `Failed to upload "${file.name}"`);
        } finally {
          setUploading(false);
        }
      }
    },
    [module, recordId, maxSize, onUpload],
  );

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (attachment: Attachment) => {
    if (!confirm(`Delete "${attachment.fileName}"? This cannot be undone.`)) return;

    setDeletingId(attachment.id);
    try {
      await uploadsApi.delete(attachment.id);
      setLocalAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
      onDelete?.(attachment.id);
      toast.success('File deleted');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-medium text-brand-black">{label}</p>
      )}

      {/* Dropzone */}
      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={!disabled ? onDrop : undefined}
        className={[
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors cursor-pointer',
          dragOver
            ? 'border-brand-red bg-brand-red/5'
            : 'border-gray-200 bg-gray-50 hover:border-brand-red/50 hover:bg-brand-red/5',
          (disabled || uploading) && 'cursor-not-allowed opacity-50',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-red" />
            <p className="text-sm text-text-muted">Uploading to Cloudinary…</p>
          </>
        ) : (
          <>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-xl">
              ☁️
            </div>
            <p className="text-sm font-medium text-brand-black">
              Drag &amp; drop files here, or{' '}
              <span className="text-brand-red underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Images, PDF, Word, Excel, Video · Max {formatBytes(maxSize)}
            </p>
          </>
        )}
      </div>

      {/* Attachment list */}
      {localAttachments.length > 0 && (
        <ul className="space-y-2">
          {localAttachments.map((att) => (
            <li
              key={att.id}
              className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
            >
              {/* Thumbnail or icon */}
              {isImage(att.mimeType) ? (
                <img
                  src={att.fileUrl}
                  alt={att.fileName}
                  className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-50 text-xl">
                  {getFileIcon(att.mimeType)}
                </span>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <a
                  href={att.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium text-brand-black hover:text-brand-red hover:underline"
                  title={att.fileName}
                >
                  {att.fileName}
                </a>
                <p className="text-xs text-text-muted">
                  {att.fileSize ? formatBytes(att.fileSize) : ''}{' '}
                  {att.createdAt
                    ? `· ${new Date(att.createdAt).toLocaleDateString()}`
                    : ''}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {/* Preview for images */}
                {isImage(att.mimeType) && (
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open full size"
                    className="rounded-md p-1.5 text-text-muted hover:bg-gray-100 hover:text-brand-black transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.54-2.29a11.05 11.05 0 000 4.58M2.46 9.71a11.05 11.05 0 000 4.58M3.51 6.51a12 12 0 0116.98 0m-16.98 10.98a12 12 0 0016.98 0" />
                    </svg>
                  </a>
                )}

                {/* Download */}
                <a
                  href={att.fileUrl}
                  download={att.fileName}
                  title="Download"
                  className="rounded-md p-1.5 text-text-muted hover:bg-gray-100 hover:text-brand-black transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>

                {/* Delete */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleDelete(att)}
                    disabled={deletingId === att.id}
                    title="Delete"
                    className="rounded-md p-1.5 text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingId === att.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-red-500" />
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
