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
        'flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4',
        className
      )}
    >
      {HERO_STATS.map((stat, i) => (
        <div key={i} role="listitem" className="flex items-center gap-1.5 cursor-default">
          <span className="text-base" aria-hidden="true">{stat.icon}</span>
          <span
            className="text-xs font-medium text-foreground"
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
