/**
 * Typed project showcase config
 *
 * Prose content (description, artistStatement, lessonsLearned, timeline milestones)
 * is internationalised via src/i18n/en.json + vi.json under the "projects" namespace.
 * Fields are kept on the interface as empty-string fallbacks to maintain backward
 * compatibility with existing tests and typed consumers.
 *
 * Structure:
 *   slug       - used in URL routing: /projects/:slug
 *   name       - display title
 *   techStack  - rendered as tag badges in gallery cards
 *   demoUrl    - live demo link (null if not applicable)
 *   repoUrl    - GitHub source link (null if not applicable)
 *   timeline.milestones - sorted by date automatically; title/description come from i18n
 *   hasBuildStory - enables "View Build Story" link on detail page
 *   availability - used to filter "available" projects in getAvailableProjects()
 */

export interface TimelineMilestone {
  date: string // ISO 8601: YYYY-MM-DD
  /** i18n key suffix - renders t('projects.{slug}.timeline.{key}.title/description') */
  key: string
}

export type ProjectAvailability = 'available' | 'not-available' | 'open-to-roles'

export interface ProjectMetrics {
  shipDays?: number
  /** ISO date (YYYY-MM-DD) of production launch — used to compute uptimeDays dynamically */
  launchDate?: string
}

export interface ProjectProofPoint {
  icon: string      // emoji icon
  text: string       // short label (≤20 chars)
}

export interface Project {
  slug: string
  name: string
  /** Alias for name - used by existing gallery components */
  title: string
  /** Short text (≤80 chars recommended for gallery card). Source of truth: i18n. */
  description: string
  techStack: string[]
  demoUrl: string | null
  repoUrl: string | null
  /** The WHY behind the project. Source of truth: i18n. */
  artistStatement: string
  timeline: {
    milestones: TimelineMilestone[]
  }
  hasBuildStory: boolean
  availability: ProjectAvailability
  /** Gallery card display */
  status: 'live' | 'building' | 'live-product'
  /** Appears in the "Featured" filter tab */
  featured?: boolean
  /** Static build metrics shown on the card */
  metrics?: ProjectMetrics
  /** Opt-out of WebSocket live metrics section (for internal/company projects) */
  hasLiveMetrics?: boolean
  /** Alias for techStack - used by existing gallery components */
  tags: string[]
  /** Alias for demoUrl - used by existing card components */
  liveUrl?: string
  /** Alias for repoUrl - used by existing card components */
  githubUrl?: string
  /** Source of truth: i18n. */
  lessonsLearned?: string
  /** Production scale indicators - shown below description */
  proofPoints?: ProjectProofPoint[]
}

// ---------------------------------------------------------------------------
// Config entries - real data reflecting Chính's actual background
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  // 1. sapo-social-channel — live-product, featured
  {
    slug: 'sapo-social-channel',
    name: 'Sapo Social Channel',
    title: 'Sapo Social Channel',
    description: '', // i18n: projects.sapo-social-channel.description
    techStack: ['ReactJS', 'Spring Boot', 'MongoDB', 'Kafka', 'RabbitMQ', 'Redux', 'Grafana'],
    tags: ['ReactJS', 'Spring Boot', 'MongoDB', 'Kafka', 'RabbitMQ', 'Redux', 'Grafana'],
    demoUrl: null,
    repoUrl: null,
    liveUrl: undefined,
    githubUrl: undefined,
    artistStatement: '', // i18n: projects.sapo-social-channel.artistStatement
    timeline: {
      milestones: [
        { date: '2022-01-01', key: 'm1' },
        { date: '2023-06-01', key: 'm2' },
        { date: '2024-01-01', key: 'm3' },
      ],
    },
    hasBuildStory: false,
    availability: 'not-available',
    status: 'live-product',
    featured: true,
    metrics: undefined,
    hasLiveMetrics: false,
    lessonsLearned: '', // i18n: projects.sapo-social-channel.lessonsLearned
    proofPoints: [
      { icon: '🏢', text: 'Enterprise SaaS' },
      { icon: '💬', text: 'Omnichannel messaging' },
      { icon: '📊', text: '3 yrs in production' },
    ],
  },

  // 2. facebook-shopping — live-product, featured
  {
    slug: 'facebook-shopping',
    name: 'Facebook Catalog & Live Shopping',
    title: 'Facebook Catalog & Live Shopping',
    description: '', // i18n: projects.facebook-shopping.description
    techStack: ['TypeScript', 'ReactJS'],
    tags: ['TypeScript', 'ReactJS'],
    demoUrl: null,
    repoUrl: null,
    liveUrl: undefined,
    githubUrl: undefined,
    artistStatement: '', // i18n: projects.facebook-shopping.artistStatement
    timeline: {
      milestones: [
        { date: '2024-01-01', key: 'm1' },
        { date: '2024-03-01', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'not-available',
    status: 'live-product',
    featured: true,
    metrics: undefined,
    hasLiveMetrics: false,
    lessonsLearned: '', // i18n: projects.facebook-shopping.lessonsLearned
    proofPoints: [
      { icon: '🔗', text: 'Meta API integration' },
      { icon: '📦', text: 'Catalog sync engine' },
    ],
  },

  // 3. wallet-app - live, featured
  {
    slug: 'wallet-app',
    name: 'Wallet App',
    title: 'Wallet App',
    description: '', // i18n: projects.wallet-app.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    demoUrl: 'https://wallet.chinhnt.xyz',
    repoUrl: 'https://github.com/chinhnt-portfolio-v2/wallet-fe',
    liveUrl: 'https://wallet.chinhnt.xyz',
    githubUrl: 'https://github.com/chinhnt-portfolio-v2/wallet-fe',
    artistStatement: '', // i18n: projects.wallet-app.artistStatement
    timeline: {
      milestones: [
        { date: '2026-03-26', key: 'm1' },
        { date: '2026-04-01', key: 'm2' },
        { date: '2026-04-01', key: 'm3' },
      ],
    },
    hasBuildStory: false,
    availability: 'available',
    status: 'live',
    featured: true,
    metrics: { shipDays: 6, launchDate: '2026-04-01' },
    lessonsLearned: '', // i18n: projects.wallet-app.lessonsLearned
    proofPoints: [
      { icon: '🔐', text: 'JWT + OAuth2' },
      { icon: '🔄', text: 'Token refresh flow' },
      { icon: '💰', text: 'Live at wallet.chinhnt.xyz' },
    ],
  },

  // 4. ledger-app — live, featured
  {
    slug: 'ledger-app',
    name: 'Expense Ledger',
    title: 'Expense Ledger',
    description: '', // i18n: projects.ledger-app.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'TanStack Query', 'Zustand', 'Recharts'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'TanStack Query', 'Zustand', 'Recharts'],
    demoUrl: 'https://ledger.chinhnt.xyz',
    repoUrl: 'https://github.com/chinhnt-portfolio-v2/ledger-fe',
    liveUrl: 'https://ledger.chinhnt.xyz',
    githubUrl: 'https://github.com/chinhnt-portfolio-v2/ledger-fe',
    artistStatement: '', // i18n: projects.ledger-app.artistStatement
    timeline: {
      milestones: [
        { date: '2026-04-03', key: 'm1' },
        { date: '2026-04-04', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'available',
    status: 'live',
    featured: true,
    metrics: { shipDays: 2, launchDate: '2026-04-04' },
    lessonsLearned: '', // i18n: projects.ledger-app.lessonsLearned
    proofPoints: [
      { icon: '📊', text: 'Monthly breakdowns' },
      { icon: '💰', text: 'Multi-wallet tracking' },
      { icon: '🔐', text: 'JWT + OAuth2 auth' },
    ],
  },

  // 5. vault-app — live, featured
  {
    slug: 'vault-app',
    name: 'Bookmark Vault',
    title: 'Bookmark Vault',
    description: '', // i18n: projects.vault-app.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'TanStack Query', 'Zustand', 'Framer Motion'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'TanStack Query', 'Zustand', 'Framer Motion'],
    demoUrl: 'https://vault.chinhnt.xyz',
    repoUrl: 'https://github.com/chinhnt-portfolio-v2/vault-fe',
    liveUrl: 'https://vault.chinhnt.xyz',
    githubUrl: 'https://github.com/chinhnt-portfolio-v2/vault-fe',
    artistStatement: '', // i18n: projects.vault-app.artistStatement
    timeline: {
      milestones: [
        { date: '2026-04-03', key: 'm1' },
        { date: '2026-04-04', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'available',
    status: 'live',
    featured: true,
    metrics: { shipDays: 2, launchDate: '2026-04-04' },
    lessonsLearned: '', // i18n: projects.vault-app.lessonsLearned
    proofPoints: [
      { icon: '🔖', text: 'URL metadata auto-fetch' },
      { icon: '🏷️', text: 'Tag cloud & folders' },
      { icon: '🔐', text: 'JWT + OAuth2 auth' },
    ],
  },

  // 6. codebin-app — live, featured
  {
    slug: 'codebin-app',
    name: 'CodeBin',
    title: 'CodeBin',
    description: '', // i18n: projects.codebin-app.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'TanStack Query', 'Zustand', 'highlight.js'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'TanStack Query', 'Zustand', 'highlight.js'],
    demoUrl: 'https://codebin.chinhnt.xyz',
    repoUrl: 'https://github.com/chinhnt-portfolio-v2/codebin-fe',
    liveUrl: 'https://codebin.chinhnt.xyz',
    githubUrl: 'https://github.com/chinhnt-portfolio-v2/codebin-fe',
    artistStatement: '', // i18n: projects.codebin-app.artistStatement
    timeline: {
      milestones: [
        { date: '2026-04-03', key: 'm1' },
        { date: '2026-04-04', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'available',
    status: 'live',
    featured: true,
    metrics: { shipDays: 2, launchDate: '2026-04-04' },
    lessonsLearned: '', // i18n: projects.codebin-app.lessonsLearned
    proofPoints: [
      { icon: '🎨', text: '50+ language highlighting' },
      { icon: '🔗', text: 'Shareable links' },
      { icon: '🔐', text: 'Password protection' },
    ],
  },

  // 7. Portfolio — live, featured
  {
    slug: 'portfolio-v2',
    name: 'Portfolio',
    title: 'Portfolio',
    description: '', // i18n: projects.portfolio-v2.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'GitHub Actions'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'GitHub Actions'],
    demoUrl: null,
    repoUrl: 'https://github.com/chinhnt-portfolio-v2/portfolio-fe',
    liveUrl: 'https://portfolio.chinhnt.xyz',
    githubUrl: 'https://github.com/chinhnt-portfolio-v2/portfolio-fe',
    artistStatement: '', // i18n: projects.portfolio-v2.artistStatement
    timeline: {
      milestones: [
        { date: '2026-03-12', key: 'm1' },
        { date: '2026-03-25', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'open-to-roles',
    status: 'live',
    featured: true,
    metrics: { shipDays: 13, launchDate: '2026-03-25' },
    lessonsLearned: '', // i18n: projects.portfolio-v2.lessonsLearned
    proofPoints: [
      { icon: '🤖', text: 'AI-augmented SDLC' },
      { icon: '🧪', text: '222 passing tests' },
      { icon: '🚀', text: 'CI/CD day 13' },
    ],
  },

  // 8. sapo-social-mobile — live-product, not featured
  {
    slug: 'sapo-social-mobile',
    name: 'Sapo Social Mobile',
    title: 'Sapo Social Mobile',
    description: '', // i18n: projects.sapo-social-mobile.description
    techStack: ['React Native', 'TypeScript'],
    tags: ['React Native', 'TypeScript'],
    demoUrl: null,
    repoUrl: null,
    liveUrl: undefined,
    githubUrl: undefined,
    artistStatement: '', // i18n: projects.sapo-social-mobile.artistStatement
    timeline: {
      milestones: [
        { date: '2025-01-01', key: 'm1' },
        { date: '2025-03-01', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'not-available',
    status: 'live-product',
    featured: false,
    metrics: undefined,
    lessonsLearned: '', // i18n: projects.sapo-social-mobile.lessonsLearned
    proofPoints: [
      { icon: '📱', text: 'React Native' },
      { icon: '🔄', text: 'Offline-first cache' },
    ],
  },

  // 9. hospital-website — live-product, not featured
  {
    slug: 'hospital-website',
    name: 'Hospital Website Application',
    title: 'Hospital Website Application',
    description: '', // i18n: projects.hospital-website.description
    techStack: ['ReactJS', 'Node.js', 'Python', 'MongoDB', 'nginx'],
    tags: ['ReactJS', 'Node.js', 'Python', 'MongoDB', 'nginx'],
    demoUrl: null,
    repoUrl: null,
    liveUrl: undefined,
    githubUrl: undefined,
    artistStatement: '', // i18n: projects.hospital-website.artistStatement
    timeline: {
      milestones: [
        { date: '2022-09-01', key: 'm1' },
        { date: '2023-05-01', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'not-available',
    status: 'live-product',
    featured: false,
    metrics: undefined,
    lessonsLearned: '', // i18n: projects.hospital-website.lessonsLearned
    proofPoints: [
      { icon: '⚙️', text: 'Load balancing' },
      { icon: '🗄️', text: 'nginx production' },
      { icon: '🎓', text: 'Graduation thesis' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Runtime validation - enforce unique slugs
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

