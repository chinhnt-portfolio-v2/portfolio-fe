/**
 * Typed project showcase config
 *
 * AC: #1, #2 — Adding/removing entries here automatically reflects in the
 * project gallery without any component code changes.
 *
 * Structure:
 *   slug       — used in URL routing: /projects/:slug
 *   name       — display title
 *   description — short text (≤80 chars recommended for gallery card)
 *   techStack  — rendered as tag badges in gallery cards
 *   demoUrl    — live demo link (null if not applicable)
 *   repoUrl    — GitHub source link (null if not applicable)
 *   artistStatement — the WHY behind the project
 *   timeline.milestones — sorted by date automatically
 *   hasBuildStory — enables "View Build Story" link on detail page
 *   availability — used to filter "available" projects in getAvailableProjects()
 */

export interface TimelineMilestone {
  date: string // ISO 8601: YYYY-MM-DD
  title: string
  description: string
}

export type ProjectAvailability = 'available' | 'not-available' | 'open-to-roles'

export interface ProjectMetrics {
  shipDays?: number
  uptimeDays?: number
}

export interface Project {
  slug: string
  name: string
  /** Alias for name — used by existing gallery components */
  title: string
  description: string
  techStack: string[]
  demoUrl: string | null
  repoUrl: string | null
  artistStatement: string
  timeline: {
    milestones: TimelineMilestone[]
  }
  hasBuildStory: boolean
  availability: ProjectAvailability
  /** Gallery card display */
  status: 'live' | 'building' | 'archived'
  /** Appears in the "Featured" filter tab */
  featured?: boolean
  /** Static build metrics shown on the card */
  metrics?: ProjectMetrics
  /** Alias for techStack — used by existing gallery components */
  tags: string[]
  /** Alias for demoUrl — used by existing card components */
  liveUrl?: string
  /** Alias for repoUrl — used by existing card components */
  githubUrl?: string
  /** Not in current schema; unused but required by ProjectCard interface */
  lessonsLearned?: string
}

// ---------------------------------------------------------------------------
// Config entries — owner fills in real data here
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  {
    slug: 'portfolio-v2',
    name: 'Portfolio v2',
    title: 'Portfolio v2',
    description:
      'Production-ready portfolio with live metrics, i18n, and WebSocket integration.',
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket'],
    demoUrl: null,
    repoUrl: 'https://github.com/chinh-dev11/portfolio-v2',
    liveUrl: undefined,
    githubUrl: 'https://github.com/chinh-dev11/portfolio-v2',
    artistStatement:
      'Built to demonstrate production-grade engineering — not just polished UI, but live infrastructure, CI/CD, and real observability. The old version was patchy; this one is built to last.',
    timeline: {
      milestones: [
        { date: '2026-02-01', title: 'First Commit', description: 'Initial project scaffold' },
        {
          date: '2026-02-15',
          title: 'App Shell + Design System',
          description: 'Component library and token system in place',
        },
        {
          date: '2026-03-05',
          title: 'Project Gallery & Hero',
          description: 'Core portfolio pages live',
        },
      ],
    },
    hasBuildStory: true,
    availability: 'open-to-roles',
    status: 'building',
    featured: true,
    metrics: { shipDays: 30 },
    lessonsLearned:
      'I would have invested in the design system upfront instead of retrofitting tokens. Building the component library first would have prevented multiple rounds of refactoring.',
  },
  {
    slug: 'wallet-app',
    name: 'Wallet App',
    title: 'Wallet App',
    description:
      'Fintech demo with Google OAuth2, transaction tracking, and JWT auth.',
    techStack: ['React', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    tags: ['React', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    demoUrl: 'https://wallet.chinh.dev',
    repoUrl: 'https://github.com/chinh-dev11/wallet-app',
    liveUrl: 'https://wallet.chinh.dev',
    githubUrl: 'https://github.com/chinh-dev11/wallet-app',
    artistStatement:
      'Built to prove I can ship a real auth system with proper security — not just a demo that breaks in prod. Every OAuth2 edge case handled, every JWT rotation covered.',
    timeline: {
      milestones: [
        { date: '2025-10-01', title: 'First Commit', description: 'Wallet app project born' },
        {
          date: '2025-11-01',
          title: 'Google OAuth2 Integration',
          description: 'Full OAuth2 flow with refresh tokens',
        },
        {
          date: '2025-12-15',
          title: 'Production Deploy',
          description: 'Live at wallet.chinh.dev',
        },
      ],
    },
    hasBuildStory: true,
    availability: 'available',
    status: 'live',
    featured: true,
    metrics: { shipDays: 47, uptimeDays: 90 },
    lessonsLearned:
      'I would have built the token refresh flow as a separate service from day one. Tangling it with the main auth flow caused painful refactoring in week 3. Separation of concerns from the start.',
  },
  {
    slug: 'portfolio-v1',
    name: 'Portfolio v1',
    title: 'Portfolio v1',
    description:
      'First portfolio iteration: React frontend + Java Spring Boot + MongoDB backend.',
    techStack: ['React', 'TypeScript', 'Spring Boot', 'MongoDB'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'MongoDB'],
    demoUrl: null,
    repoUrl: 'https://github.com/chinh-dev11/portfolio',
    liveUrl: undefined,
    githubUrl: 'https://github.com/chinh-dev11/portfolio',
    artistStatement:
      'My first attempt at a full-stack portfolio. Buggy and patchy in hindsight — but it taught me everything I needed to build v2 properly.',
    timeline: {
      milestones: [
        { date: '2025-06-01', title: 'First Commit', description: 'Portfolio v1 started' },
        {
          date: '2025-08-01',
          title: 'Backend API Complete',
          description: 'Full REST API with MongoDB',
        },
        {
          date: '2025-09-15',
          title: 'Production Deploy',
          description: 'First live version deployed',
        },
      ],
    },
    hasBuildStory: false,
    availability: 'not-available',
    status: 'archived',
    featured: false,
    metrics: { shipDays: 60 },
    lessonsLearned:
      "I should have defined the data model before touching the UI. I ended up changing the MongoDB schema three times, which broke the frontend each time. Schema-first development is the lesson.",
  },
]

// ---------------------------------------------------------------------------
// Runtime validation — enforce unique slugs
// ---------------------------------------------------------------------------
const slugs = projects.map((p) => p.slug)
const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
if (duplicates.length > 0) {
  throw new Error(`[config/projects.ts] Duplicate project slugs: ${[...new Set(duplicates)].join(', ')}`)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the project with the given slug, or undefined if not found. */
export const getProjectBySlug = (slug: string): Project | undefined => {
  const project = projects.find((p) => p.slug === slug)
  if (!project) return undefined
  return {
    ...project,
    timeline: {
      milestones: [...project.timeline.milestones].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    },
  }
}

/** Returns all projects. */
export const getAllProjects = (): Project[] => projects

/** Returns only projects that are currently available for hire work. */
export const getAvailableProjects = (): Project[] =>
  projects.filter((p) => p.availability === 'available')
