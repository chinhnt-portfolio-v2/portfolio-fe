import { cn } from '@/lib/utils'

type Status = 'live' | 'building' | 'archived'

interface StatusIndicatorProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { dotClass: string; label: string; pulse: boolean }> = {
  live: {
    dotClass: 'bg-live',
    label: 'Live',
    pulse: true,
  },
  building: {
    dotClass: 'bg-warning',
    label: 'Building',
    pulse: false,
  },
  archived: {
    dotClass: 'bg-muted-foreground',
    label: 'Archived',
    pulse: false,
  },
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={`Project status: ${status}`}
    >
      <span
        className={cn('h-2 w-2 rounded-full', config.dotClass, config.pulse && 'status-pulse')}
      />
      <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
    </span>
  )
}
