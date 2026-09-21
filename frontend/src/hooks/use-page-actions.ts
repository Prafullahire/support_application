import { toast } from 'sonner';
import { useUiStore } from '@/lib/ui-store';

export function usePageActions() {
  const showLoader = useUiStore((s) => s.showLoader);
  const hideLoader = useUiStore((s) => s.hideLoader);

  const withToast = async <T,>(
    action: () => Promise<T>,
    messages: { success?: string; error?: string; loading?: string } = {},
  ): Promise<T | null> => {
    const toastId = messages.loading ? toast.loading(messages.loading) : undefined;
    try {
      const result = await action();
      if (toastId) toast.dismiss(toastId);
      if (messages.success) toast.success(messages.success);
      return result;
    } catch (err) {
      if (toastId) toast.dismiss(toastId);
      const message = err instanceof Error ? err.message : messages.error || 'Operation failed';
      toast.error(message);
      return null;
    }
  };

  const withGlobalLoader = async <T,>(
    action: () => Promise<T>,
    message = 'Please wait...',
  ): Promise<T | null> => {
    showLoader(message);
    try {
      return await action();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
      return null;
    } finally {
      hideLoader();
    }
  };

  return { withToast, withGlobalLoader };
}

export { toast };
