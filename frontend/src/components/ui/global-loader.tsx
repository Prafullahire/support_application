'use client';

import { useUiStore } from '@/lib/ui-store';
import { Spinner } from './spinner';

export function GlobalLoader() {
  const isGlobalLoading = useUiStore((s) => s.isGlobalLoading);
  const loadingMessage = useUiStore((s) => s.loadingMessage);

  if (!isGlobalLoading) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[150] flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-xl">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-black">{loadingMessage || 'Please wait...'}</p>
      </div>
    </div>
  );
}
