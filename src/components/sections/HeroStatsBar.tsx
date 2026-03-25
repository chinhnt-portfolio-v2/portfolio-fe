import { HERO_STATS } from '@/config/about'
import { cn } from '@/lib/utils'

interface HeroStatsBarProps {
  className?: string
}

export function HeroStatsBar({ className }: HeroStatsBarProps) {
  return (
    <div
      role="list"
      aria-label="Professional proof points"
      className={cn(
        'flex flex-wrap gap-x-6 gap-y-2.5 border-t border-border pt-4.5',
        className
      )}
    >
      {HERO_STATS.map((stat, i) => (
        <div key={i} role="listitem" className="flex items-center gap-2 cursor-default">
          <span className="text-[15px] leading-none" aria-hidden="true">{stat.icon}</span>
          <span
            className="text-[var(--text-small)] font-medium leading-tight text-foreground"
            title={stat.tooltip}
            aria-label={stat.label}
          >
            {stat.label}
          </span>
          {stat.sublabel && (
            <span className="text-xs text-muted-foreground">
              {stat.sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
