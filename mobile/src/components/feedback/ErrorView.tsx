import { ErrorState } from './ErrorState';

interface ErrorViewProps {
  error: unknown;
  onRetry?: () => void;
}

/** @deprecated Prefer ErrorState directly for richer layout control. */
export function ErrorView({ error, onRetry }: ErrorViewProps) {
  return <ErrorState error={error} onRetry={onRetry} />;
}
