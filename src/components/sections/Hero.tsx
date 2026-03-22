import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { AIWorkflowStrip } from '@/components/sections/AIWorkflowStrip'
import { HeroStatsBar } from '@/components/sections/HeroStatsBar'
import { EyebrowChip } from '@/components/shared/EyebrowChip'
import { HeroCardStack } from '@/components/shared/HeroCardStack'
import { WelcomeBackBanner } from '@/components/shared/WelcomeBackBanner'
import { SPRING_GENTLE } from '@/constants/motion'
import { useReferralStore } from '@/stores/referralStore'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'

function fadeUp(delay: number, skipAnimation: boolean) {
  if (skipAnimation) {
    return {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    }
  }
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { ...SPRING_GENTLE, delay },
  }
}

/**
 * Get contextual hero content based on referral source.
 * Returns undefined if no contextual content is available.
 */
function getContextualContent(
  referralSource: string | null,
  t: (key: string) => string
): { eyebrow: string; tagline: string } | undefined {
  if (!referralSource) return undefined

  const contextKey = `hero.context.${referralSource}` as const
  const eyebrow = t(`${contextKey}.eyebrow`)
  const tagline = t(`${contextKey}.tagline`)

  // Check if translation exists (fallback to default if key not found)
  if (eyebrow === `${contextKey}.eyebrow` || tagline === `${contextKey}.tagline`) {
    return undefined
  }

  return { eyebrow, tagline }
}

export function Hero() {
  const { t } = useTranslation()
  const referralSource = useReferralStore((state) => state.referralSource)
  const { lastViewedSlug, _hasHydrated } = useReturnVisitorStore()

  // Skip hero animation for returning visitors
  // Also skip if the store hasn't hydrated yet to avoid hydration mismatch
  const skipHeroAnimation = _hasHydrated && lastViewedSlug !== null && lastViewedSlug !== ''

  // Get contextual content if referral source exists
  const contextualContent = getContextualContent(referralSource, t)

  // Use contextual content or default
  const eyebrow = contextualContent?.eyebrow ?? t('hero.eyebrow')
  const tagline = contextualContent?.tagline ?? t('hero.tagline')

  return (
    <>
      <section
        id="hero"
        aria-label="Hero"
        className="relative overflow-hidden bg-[#050508] py-24 lg:py-32"
      >
        {/* Ambient glows — CSS only, pointer-events: none */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px]"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.07), transparent 70%)',
          }}
        />

        <div className="section-container grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* Left column: copy — sequential stagger */}
          <div className="flex flex-col gap-6">
            <motion.div {...fadeUp(0, skipHeroAnimation)}>
              <EyebrowChip variant="role">{eyebrow}</EyebrowChip>
            </motion.div>

            <motion.div {...fadeUp(0.08, skipHeroAnimation)}>
              <h1
                className="text-[var(--text-display)] font-[var(--font-weight-display)] tracking-[var(--letter-spacing-display)] text-foreground"
              >
                {t('hero.headingPrefix')}{' '}
                <span className="gradient-headline">{t('hero.headingHighlight')}</span>
              </h1>
            </motion.div>

            <motion.div {...fadeUp(0.16, skipHeroAnimation)}>
              <p
                className="max-w-[380px] text-[13px] text-muted-foreground"
                {...(referralSource && {
                  'aria-live': 'polite',
                  'aria-atomic': 'true',
                })}
              >
                {tagline}
              </p>
            </motion.div>

            {/* CTA row */}
            <motion.div {...fadeUp(0.24, skipHeroAnimation)} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] transition-shadow hover:shadow-[0_0_22px_rgba(168,85,247,0.6)] focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t('hero.cta.evidence')}
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t('hero.cta.contact')}
                </a>
              </div>
              <motion.div {...fadeUp(0.32, skipHeroAnimation)}>
                <HeroStatsBar />
              </motion.div>
              <motion.div {...fadeUp(0.40, skipHeroAnimation)}>
                <AIWorkflowStrip />
              </motion.div>
            </motion.div>
          </div>

          {/* Right column: HeroCardStack — enters from right with slight delay */}
          <motion.div
            initial={skipHeroAnimation ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={skipHeroAnimation ? { duration: 0 } : { ...SPRING_GENTLE, delay: 0.2 }}
            className="relative lg:flex lg:justify-end"
          >
            <HeroCardStack className="w-full max-w-sm" />
            {/* Bottom fade hint on mobile (card stack overflow suggestion) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050508] to-transparent lg:hidden"
            />
          </motion.div>
        </div>
      </section>

      {/* Welcome Back Banner - appears below hero for returning visitors */}
      <WelcomeBackBanner />
    </>
  )
}
