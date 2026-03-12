interface Milestone {
  label: string
  date: string // ISO: "YYYY-MM-DD"
}

interface BuildTimelineProps {
  milestones: Milestone[]
}

function formatMilestoneDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

export function BuildTimeline({ milestones }: BuildTimelineProps) {
  if (milestones.length === 0) return null

  return (
    <ol aria-label="Build timeline" className="relative ml-4 space-y-6 border-l-2 border-border pl-6">
      {milestones.map((milestone, i) => (
        <li key={milestone.label} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="absolute -left-[1.125rem] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-sm font-semibold text-foreground"
          >
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <span className="block font-medium text-foreground">{milestone.label}</span>
            <time dateTime={milestone.date} className="block text-sm text-muted-foreground">
              {formatMilestoneDate(milestone.date)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  )
}
