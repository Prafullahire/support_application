import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

interface LoadingStateProps {
  message?: string;
  height?: string;
}

export function LoadingState({ message = 'Loading...', height = 'h-32' }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', height)}>
      <Spinner />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
