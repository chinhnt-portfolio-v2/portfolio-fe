import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

type Status = 'live' | 'building' | 'archived'

interface StatusIndicatorProps {
  status: Status
  className?: string
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const { t } = useTranslation()

  const dotConfig: Record<Status, { dotClass: string; pulse: boolean }> = {
    live: { dotClass: 'bg-live', pulse: true },
    building: { dotClass: 'bg-warning', pulse: false },
    archived: { dotClass: 'bg-muted-foreground', pulse: false },
  }

  const dot = dotConfig[status]

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={`Project status: ${status}`}
    >
      <span
        className={cn('h-2 w-2 rounded-full', dot.dotClass, dot.pulse && 'status-pulse')}
      />
      <span className="text-xs font-medium text-muted-foreground">{t(`statusIndicator.${status}`)}</span>
    </span>
  )
}
