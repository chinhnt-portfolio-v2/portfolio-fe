import { useRef } from 'react'

import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import { MetricPair } from './MetricPair'
import { StatusIndicator } from './StatusIndicator'
import type { ProjectProofPoint } from '@/config/projects'
import { SPRING_GENTLE } from '@/constants/motion'
import { formatRelativeTime } from '@/lib/formatDate'
import { cn } from '@/lib/utils'
import { useCursorStore } from '@/stores/cursorStore'
import { useMetricsStore } from '@/stores/metricsStore'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'

interface ProjectCardProps {
  slug: string
  title: string
  description: string
  status: 'live' | 'building' | 'live-product'
  tags: string[]
  metrics?: {
    shipDays?: number
    uptimeDays?: number
  }
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  /** Opt-out of WebSocket live metrics section (for internal/company projects) */
  hasLiveMetrics?: boolean
  index: number
  /** Production scale indicators — shown below description */
  proofPoints?: ProjectProofPoint[]
}

export function ProjectCard({
  slug,
  title,
  description,
  status,
  tags,
  metrics,
  liveUrl,
  githubUrl,
  hasLiveMetrics,
  index,
  proofPoints,
}: ProjectCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const navigate = useNavigate()

  // Return visitor tracking
  const setLastViewedSlug = useReturnVisitorStore((state) => state.setLastViewedSlug)
  const updateTimestamp = useReturnVisitorStore((state) => state.updateTimestamp)

  // WebSocket metrics integration
  const liveMetrics = useMetricsStore((state) => state.metrics[slug])
  const connectionState = useMetricsStore((state) => state.connectionState)
  const getProjectStatus = useMetricsStore((state) => state.getProjectStatus)

  const projectStatus = getProjectStatus(slug)
  const { t } = useTranslation()
  const { setCursorType, setLabel } = useCursorStore()

  // Handle card click - track as last viewed project
  const handleCardClick = () => {
    setLastViewedSlug(slug)
    updateTimestamp()
    navigate(`/projects/${slug}`)
  }

  // Format timestamp for display - show "Updated X ago" when stale (AC5)
  const staleDisplay = projectStatus === 'stale' && liveMetrics?.lastUpdated
    ? `Updated ${formatRelativeTime(liveMetrics.lastUpdated)}`
    : null

  return (
    <motion.article
      ref={ref}
      aria-label={title}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...SPRING_GENTLE, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: SPRING_GENTLE }}
      onClick={handleCardClick}
      onMouseEnter={() => { setCursorType('project'); setLabel('View →'); }}
      onMouseLeave={() => { setCursorType('default'); setLabel(''); }}
      className={cn(
        'group relative flex cursor-pointer flex-col rounded-2xl border border-white/10 bg-bg-card p-7',
        'shadow-[0_0_0px_rgba(168,85,247,0)] transition-shadow duration-200',
        'hover:shadow-[0_0_28px_rgba(168,85,247,0.25)]',
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-[var(--text-h2)] font-[var(--font-weight-h2)] tracking-[var(--letter-spacing-h2)] text-foreground leading-tight">
          {title}
        </h2>
        <StatusIndicator status={status} />
      </div>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>

      {/* Proof points strip */}
      {proofPoints && proofPoints.length > 0 && (
        <div
          role="list"
          aria-label="Project proof points"
          className="mb-3 flex flex-wrap gap-x-3 gap-y-1"
        >
          {proofPoints.map((point, i) => (
            <div
              key={i}
              role="listitem"
              className="flex items-center gap-1"
            >
              <span aria-hidden="true" className="text-[10px]">{point.icon}</span>
              <span className="text-[10px] text-muted-foreground">{point.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metrics row - static metrics */}
      {(metrics?.shipDays !== undefined || metrics?.uptimeDays !== undefined) && (
        <div className="mb-4 flex gap-6">
          {metrics.shipDays !== undefined && (
            <MetricPair value={metrics.shipDays} label={t('projects.daysToShip')} />
          )}
          {metrics.uptimeDays !== undefined && (
            <MetricPair value={metrics.uptimeDays} label={t('projects.daysUptime')} />
          )}
        </div>
      )}

      {/* Live WebSocket metrics row - hidden when status is 'hidden' (AC1: > 24h = hide entirely) */}
      {hasLiveMetrics !== false && connectionState !== 'connecting' && projectStatus !== 'hidden' && (
        <div className="mb-4 flex gap-6">
          {projectStatus === 'live' && liveMetrics?.uptime !== undefined && (
            <MetricPair value={liveMetrics.uptime} label={t('projects.uptime')} suffix="%" />
          )}
          {projectStatus === 'live' && liveMetrics?.responseTime !== undefined && (
            <MetricPair value={liveMetrics.responseTime} label={t('projects.responseTime')} />
          )}
          {projectStatus === 'stale' && staleDisplay && (
            <span className="text-xs text-muted-foreground">{staleDisplay}</span>
          )}
          {projectStatus === 'unavailable' && !liveMetrics?.hasReceivedData && (
            <span className="text-xs text-muted-foreground">{t('projects.statusUnavailable')}</span>
          )}
        </div>
      )}

      {/* Tech stack tags — max 5 visible */}
      <div className="mb-4 flex flex-wrap gap-1.5 overflow-hidden" style={{ maxHeight: '4rem' }}>
        {tags.slice(0, 5).map(tag => (
          <span
            key={tag}
            className="inline-flex rounded-full bg-bg-elevated px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-auto flex items-center gap-3 pt-2">
        <Link
          to={`/projects/${slug}`}
          className="text-sm font-medium text-brand hover:text-brand-light transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
          aria-label={`${t('projects.viewProjectAria')} ${title}`}
        >
          {t('projects.viewProject')}
        </Link>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
            aria-label={`${t('projects.viewLiveDemo')} ${title}`}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => { setCursorType('external'); setLabel('Open ↗'); }}
            onMouseLeave={() => { setCursorType('default'); setLabel(''); }}
          >
            <ExternalLink size={14} />
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
            aria-label={`${t('projects.viewSourceCode')} ${title}`}
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => { setCursorType('external'); setLabel('Open ↗'); }}
            onMouseLeave={() => { setCursorType('default'); setLabel(''); }}
          >
            <Github size={14} />
          </a>
        )}
      </div>
    </motion.article>
  )
}
