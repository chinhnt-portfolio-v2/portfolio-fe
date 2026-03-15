import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SPRING_GENTLE } from '@/constants/motion'
import { projects } from '@/constants/projects'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'

export function WelcomeBackBanner() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  const { lastViewedSlug, bannerDismissed, dismissBanner, _hasHydrated } = useReturnVisitorStore()

  // Don't render if:
  // 1. Not hydrated yet (to avoid hydration mismatch)
  // 2. No last viewed slug
  // 3. Banner was dismissed
  if (!_hasHydrated || !lastViewedSlug || bannerDismissed) {
    return null
  }

  // Find the project name from slug
  const project = projects.find((p) => p.slug === lastViewedSlug)
  const projectName = project?.title ?? lastViewedSlug

  // Animation: instant if reduced motion, otherwise spring-gentle (150ms)
  const animationProps = prefersReducedMotion
    ? { initial: { opacity: 1, height: 'auto' }, animate: { opacity: 1, height: 'auto' } }
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        transition: { ...SPRING_GENTLE, duration: 0.15 },
      }

  return (
    <motion.div
      {...animationProps}
      className="border-b border-border bg-surface-elevated"
      role="status"
      aria-live="polite"
    >
      <div className="section-container mx-auto flex max-h-[48px] items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="whitespace-nowrap text-sm text-foreground">
            {t('returnVisitor.banner.welcomeBack')}
          </span>
          <Link
            to={`/projects/${lastViewedSlug}`}
            className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-light focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
            aria-label={`Continue viewing ${projectName}`}
          >
            {projectName} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={dismissBanner}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label={t('returnVisitor.banner.dismiss')}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </motion.div>
  )
}
