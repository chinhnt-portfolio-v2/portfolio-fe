import { cn } from '@/lib/utils'

interface MetricPairProps {
  value: number | string
  label: string
  suffix?: string
  className?: string
}

export function MetricPair({ value, label, suffix, className }: MetricPairProps) {
  return (
    <div className={cn('flex flex-col', className)} aria-label={`${value}${suffix || ''} ${label}`}>
      <span className="text-2xl font-bold tabular-nums text-foreground leading-none">
        {value}{suffix}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )
}
