// Video walkthrough space reservation: slot reserved for future story
import { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { BuildTimeline } from '@/components/shared/BuildTimeline'
import { StatusIndicator } from '@/components/shared/StatusIndicator'
import { Badge } from '@/components/ui/badge'
import { SPRING_GENTLE } from '@/constants/motion'
import { projects } from '@/constants/projects'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find(p => p.slug === slug)
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const { t } = useTranslation()

  if (!project) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="mb-6 text-muted-foreground">{t('projectDetail.notFound')}</p>
        <Link to="/" className="text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm">
          {t('projectDetail.backToGallery')}
        </Link>
      </main>
    )
  }

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12">
      {/* Back navigation */}
      <Link to="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm">
        {t('projectDetail.backToGallery')}
      </Link>

      {/* Hero block */}
      <div className="mb-6 mt-4">
        <h1 className="mb-2 text-3xl font-bold text-foreground">{project.title}</h1>
        <StatusIndicator status={project.status} />
      </div>

      {/* Artist Statement */}
      {project.artistStatement && (
        <p className="mb-6 text-lg text-muted-foreground">{project.artistStatement}</p>
      )}

      {/* Tech stack */}
      <div role="list" aria-label="Tech stack" className="mb-6 flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <Badge key={tag} variant="outline" role="listitem">
            {tag}
          </Badge>
        ))}
      </div>

      {/* External links */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
          >
            {t('projectDetail.viewLive')}
          </a>
        ) : project.status === 'building' ? (
          <span
            className="inline-flex items-center gap-2 cursor-default opacity-40"
            aria-label={t('projectDetail.viewLiveAriaLabel')}
          >
            {t('projectDetail.viewLive')}
            <Badge variant="secondary">{t('projectDetail.viewLiveSoon')}</Badge>
          </span>
        ) : null}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
          >
            {t('projectDetail.viewGitHub')}
          </a>
        )}
      </div>

      {/* Build Timeline */}
      {project.timeline && project.timeline.milestones.length >= 2 && (
        <section aria-labelledby="timeline-heading" className="mb-8">
          <h2 id="timeline-heading" className="mb-4 text-lg font-semibold text-foreground">
            {t('projectDetail.buildTimeline')}
          </h2>
          <BuildTimeline milestones={project.timeline.milestones} />
        </section>
      )}

      {/* Collapsible: What I'd do differently */}
      {project.lessonsLearned && (
        <section aria-labelledby="lessons-heading" className="mb-8">
          <button
            id="lessons-heading"
            onClick={() => setLessonsOpen(o => !o)}
            aria-expanded={lessonsOpen}
            className="flex w-full items-center justify-between text-left text-base font-semibold text-foreground hover:text-brand focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
          >
            <span>{t('projectDetail.lessonsLearned')}</span>
            <span aria-hidden="true">{lessonsOpen ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {lessonsOpen && (
              <motion.div
                key="lessons"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SPRING_GENTLE}
                style={{ overflow: 'hidden' }}
                data-testid="lessons-content"
              >
                <p className="mt-3 text-muted-foreground">{project.lessonsLearned}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* BuildStoryPreview placeholder — Phase 2 (reserved slot, no layout shift) */}
      <div aria-hidden="true" />

      {/* Video walkthrough slot — reserved for future story */}
      <div>{/* Video walkthrough slot — reserved for future story */}</div>
    </main>
  )
}
