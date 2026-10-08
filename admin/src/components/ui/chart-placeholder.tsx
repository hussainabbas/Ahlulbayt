'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartPlaceholderProps {
  title: string;
  data?: Array<{ date: string; count: number }>;
  emptyLabel?: string;
}

const PLACEHOLDER = Array.from({ length: 14 }, (_, i) => ({
  date: `D${i + 1}`,
  count: Math.floor(40 + Math.random() * 80),
}));

export function ChartPlaceholder({ title, data, emptyLabel = 'No data yet' }: ChartPlaceholderProps) {
  const chartData = data?.length ? data : PLACEHOLDER;
  const isStub = !data?.length;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {isStub ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
            placeholder
          </span>
        ) : null}
      </div>
      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(158 55% 45%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(158 55% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={32} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(158 55% 45%)"
                fill="url(#fillPrimary)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
