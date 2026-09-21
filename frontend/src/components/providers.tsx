'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { GlobalLoader } from '@/components/ui/global-loader';
import { useUiStore } from '@/lib/ui-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const hideLoader = useUiStore((s) => s.hideLoader);

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: 'border border-neutral-200 shadow-lg',
            success: 'bg-white text-black',
            error: 'bg-white text-black',
            info: 'bg-white text-black',
            warning: 'bg-white text-black',
          },
        }}
      />
      <GlobalLoader />
    </>
  );
}
