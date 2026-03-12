import { useRef } from 'react'

import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { MetricPair } from './MetricPair'
import { StatusIndicator } from './StatusIndicator'
import { SPRING_GENTLE } from '@/constants/motion'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  slug: string
  title: string
  description: string
  status: 'live' | 'building' | 'archived'
  tags: string[]
  metrics?: {
    shipDays?: number
    uptimeDays?: number
  }
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  index: number
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
  index,
}: ProjectCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const navigate = useNavigate()

  return (
    <motion.article
      ref={ref}
      aria-label={title}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...SPRING_GENTLE, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: SPRING_GENTLE }}
      onClick={() => navigate(`/projects/${slug}`)}
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

      {/* Metrics row */}
      {(metrics?.shipDays !== undefined || metrics?.uptimeDays !== undefined) && (
        <div className="mb-4 flex gap-6">
          {metrics.shipDays !== undefined && (
            <MetricPair value={metrics.shipDays} label="days to ship" />
          )}
          {metrics.uptimeDays !== undefined && (
            <MetricPair value={metrics.uptimeDays} label="days uptime" />
          )}
        </div>
      )}

      {/* Tech stack tags — max 5 visible */}
      <div className="mb-4 flex flex-wrap gap-1.5 overflow-hidden" style={{ maxHeight: '2rem' }}>
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
          aria-label={`View project ${title}`}
        >
          View project →
        </Link>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
            aria-label={`Open live demo for ${title}`}
            onClick={e => e.stopPropagation()}
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
            aria-label={`View source code for ${title} on GitHub`}
            onClick={e => e.stopPropagation()}
          >
            <Github size={14} />
          </a>
        )}
      </div>
    </motion.article>
  )
}
