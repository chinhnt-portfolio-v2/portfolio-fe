import { cn } from '@/lib/utils'

interface MetricPairProps {
  value: number | string
  label: string
  className?: string
}

export function MetricPair({ value, label, className }: MetricPairProps) {
  return (
    <div className={cn('flex flex-col', className)} aria-label={`${value} ${label}`}>
      <span className="text-2xl font-bold tabular-nums text-foreground leading-none">
        {value}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )
}
