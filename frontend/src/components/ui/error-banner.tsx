interface ErrorBannerProps {
  error: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-primary-300 bg-red-50 px-4 py-3 text-primary-700">
      <p className="text-sm">{error}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm font-medium hover:text-primary-900"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
