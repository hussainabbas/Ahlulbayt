import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MetricCard({ label, value, hint, trend = 'neutral', className }: MetricCardProps) {
  const trendColor =
    trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 shadow-card transition-colors hover:border-primary/30',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className={cn('mt-1 text-xs', trendColor)}>{hint}</p> : null}
    </div>
  );
}
