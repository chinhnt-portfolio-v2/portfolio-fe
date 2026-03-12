import { MetricPair } from './MetricPair'
import { StatusIndicator } from './StatusIndicator'
import { projects } from '@/constants/projects'
import { cn } from '@/lib/utils'

interface HeroCardStackProps {
  className?: string
}

function computeMetrics() {
  const shippedProjects = projects.filter(p => p.status !== 'building')
  const projectCount = shippedProjects.length

  const shipDayValues = projects
    .filter(p => p.metrics?.shipDays !== undefined)
    .map(p => p.metrics!.shipDays!)
  const avgShipDays =
    shipDayValues.length > 0
      ? Math.round(shipDayValues.reduce((a, b) => a + b, 0) / shipDayValues.length)
      : null

  return { projectCount, avgShipDays }
}

export function HeroCardStack({ className }: HeroCardStackProps) {
  const { projectCount, avgShipDays } = computeMetrics()

  return (
    <div
      role="region"
      aria-label="Portfolio overview"
      className={cn(
        'rounded-2xl border border-white/10 bg-bg-card p-6',
        'shadow-[0_0_18px_rgba(168,85,247,0.1)] transition-shadow duration-300',
        'hover:shadow-[0_0_28px_rgba(168,85,247,0.25)]',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <StatusIndicator status="live" />
      </div>

      <div className="flex flex-col gap-4">
        <MetricPair
          value={projectCount}
          label="projects shipped"
        />

        {avgShipDays !== null && (
          <MetricPair
            value={avgShipDays}
            label="avg. days to ship"
          />
        )}

        <MetricPair
          value="99%+"
          label="uptime (30d)"
        />
      </div>
    </div>
  )
}
