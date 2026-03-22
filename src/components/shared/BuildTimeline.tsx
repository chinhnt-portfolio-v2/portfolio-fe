import type { TFunction } from 'i18next'

interface BuildTimelineProps {
  milestones: Array<{
    date: string // ISO: "YYYY-MM-DD"
    /** i18n key suffix — renders t('projects.{slug}.timeline.{key}.title/description') */
    key: string
  }>
  /** Project slug — used to construct i18n key prefix */
  slug: string
  /** i18next t function */
  t: TFunction
}

function formatMilestoneDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

export function BuildTimeline({ milestones, slug, t }: BuildTimelineProps) {
  if (milestones.length === 0) return null

  return (
    <ol aria-label="Build timeline" className="relative ml-4 space-y-6 border-l-2 border-border pl-6">
      {milestones.map((milestone, i) => {
        const title = t(`projects.${slug}.timeline.${milestone.key}.title`)
        const description = t(`projects.${slug}.timeline.${milestone.key}.description`)
        return (
          <li key={`${slug}-${milestone.key}`} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="absolute -left-[1.125rem] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-sm font-semibold text-foreground"
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <span className="block font-medium text-foreground">{title}</span>
              <time dateTime={milestone.date} className="block text-sm text-muted-foreground">
                {description || formatMilestoneDate(milestone.date)}
              </time>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
