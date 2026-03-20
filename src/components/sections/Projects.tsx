import { useEffect, useMemo } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { FilterChip } from '@/components/shared/FilterChip'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { SPRING_GENTLE } from '@/constants/motion'
import { getAllProjects } from '@/config/projects'
import { useGalleryStore } from '@/stores/galleryStore'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'

// Config-driven project list — add/remove entries in src/config/projects.ts
// no component changes required.
const projects = getAllProjects()

function getInitialFilter(returnVisitorTab: string | null): string | null {
  const params = new URLSearchParams(window.location.search)
  const urlFilter = params.get('filter')
  if (urlFilter !== null) {
    return urlFilter || null
  }

  // Priority 1: Return visitor's last viewed tab
  if (returnVisitorTab === 'featured' || returnVisitorTab === 'technical') {
    return returnVisitorTab
  }

  // Priority 2: Referrer heuristic - GitHub → All (null), everything else → Featured
  if (document.referrer.includes('github.com')) {
    return null
  }
  return 'featured'
}

function updateUrl(filter: string | null) {
  const params = new URLSearchParams()
  if (filter) params.set('filter', filter)
  const newUrl = filter
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname
  history.pushState(null, '', newUrl)
}

// Derive unique sorted tech tags from all projects
function getFilterLabels(): string[] {
  const allTags = projects.flatMap(p => p.techStack)
  const unique = Array.from(new Set(allTags)).sort()
  return unique
}

export function Projects() {
  const { activeFilter, setActiveFilter } = useGalleryStore()
  const { t } = useTranslation()
  const { lastViewedTab, setLastViewedTab, _hasHydrated } = useReturnVisitorStore()

  // On mount: read URL params, return visitor tab, or apply referrer heuristic
  useEffect(() => {
    // Only apply return visitor tab if store has hydrated
    const returnVisitorTab = _hasHydrated ? lastViewedTab : null
    const initial = getInitialFilter(returnVisitorTab)
    setActiveFilter(initial)
  }, [setActiveFilter, _hasHydrated, lastViewedTab])

  const filterLabels = useMemo(() => getFilterLabels(), [])

  const filteredProjects = useMemo(() => {
    if (activeFilter === null) return projects
    if (activeFilter === 'featured') return projects.filter(p => p.featured)
    return projects.filter(p =>
      p.techStack.some(tag => tag.toLowerCase() === activeFilter.toLowerCase()),
    )
  }, [activeFilter])

  function handleFilterChange(filter: string | null) {
    setActiveFilter(filter)
    updateUrl(filter)

    // Track tab selection for return visitors
    if (filter === 'featured' || filter === 'technical') {
      setLastViewedTab(filter)
    }
  }

  return (
    <section id="projects" aria-label="Projects" className="py-24">
      <div className="section-container">
        <h2 className="mb-10 text-[var(--text-h1)] font-[var(--font-weight-h1)] tracking-[var(--letter-spacing-h1)] text-foreground">
          {t('projects.heading')}
        </h2>

        {/* FilterChips */}
        <div role="group" aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">
          <FilterChip
            label={t('projects.filter.all')}
            isActive={activeFilter === null}
            onClick={() => handleFilterChange(null)}
          />
          <FilterChip
            label={t('projects.filter.featured')}
            isActive={activeFilter === 'featured'}
            onClick={() => handleFilterChange('featured')}
          />
          {filterLabels.map(tag => (
            <FilterChip
              key={tag}
              label={tag}
              isActive={activeFilter?.toLowerCase() === tag.toLowerCase()}
              onClick={() => handleFilterChange(tag)}
            />
          ))}
        </div>

        {/* Project grid with AnimatePresence */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, i) => (
                <motion.div
                  key={project.slug}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={SPRING_GENTLE}
                >
                  <ProjectCard {...project} index={i} />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={SPRING_GENTLE}
                className="col-span-full py-16 text-center"
              >
                <p className="mb-2 text-muted-foreground">{t('projects.emptyState.message')}</p>
                <button
                  type="button"
                  onClick={() => handleFilterChange(null)}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  {t('projects.emptyState.reset')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
