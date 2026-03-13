import { useRef } from 'react'

import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { GitHubGraph } from '@/components/shared/GitHubGraph'
import { Badge } from '@/components/ui/badge'
import { STATUS_COLOR, aboutContent } from '@/constants/about'
import { GITHUB_USERNAME } from '@/constants/config'
import { SPRING_GENTLE } from '@/constants/motion'
import { projects } from '@/constants/projects'

interface RevealBlockProps {
  children: React.ReactNode
  delay?: number
}

function RevealBlock({ children, delay = 0 }: RevealBlockProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ ...SPRING_GENTLE, delay }}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  const { skills, availability } = aboutContent
  const { t } = useTranslation()

  return (
    <section id="about" aria-labelledby="about-heading" className="section-container py-24">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Why Hire Me */}
        <RevealBlock delay={0}>
          <div>
            <h2 id="about-heading" className="text-2xl font-semibold mb-4">{t('about.heading')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('about.whyHireMe')}</p>
          </div>
        </RevealBlock>

        {/* Skills with proof */}
        <RevealBlock delay={0.05}>
          <div>
            <h3 className="text-lg font-medium mb-3">{t('about.skills.heading')}</h3>
            <ul
              role="list"
              className="flex flex-wrap gap-2 list-none p-0 m-0"
              aria-label="Verified skills with proof"
            >
              {skills.map((skill) => {
                const project = projects.find((p) => p.slug === skill.projectSlug)
                const href = project?.liveUrl ?? project?.githubUrl ?? '#'
                return (
                  <li key={`${skill.tech}-${skill.version}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${skill.tech} ${skill.version} — view proof project`}
                      className="focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
                    >
                      <Badge variant="secondary">
                        {skill.tech} {skill.version}
                      </Badge>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </RevealBlock>

        {/* Availability */}
        <RevealBlock delay={0.10}>
          <div>
            <h3 className="text-lg font-medium mb-3">{t('about.availability.heading')}</h3>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white"
                style={{ backgroundColor: STATUS_COLOR[availability.status] ?? '#6B7280' }}
                aria-label={`Job availability: ${t(`about.availability.${availability.status}`)}`}
              >
                <span className="h-2 w-2 rounded-full bg-white opacity-80" aria-hidden="true" />
                {t(`about.availability.${availability.status}`)}
              </span>
              <span className="text-muted-foreground text-sm">{t('about.availability.location')}</span>
            </div>
          </div>
        </RevealBlock>

        {/* GitHub Contributions - Live Evidence */}
        <RevealBlock delay={0.15}>
          <GitHubGraph username={GITHUB_USERNAME} />
        </RevealBlock>
      </div>
    </section>
  )
}
