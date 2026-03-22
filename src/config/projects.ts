/**
 * Typed project showcase config
 *
 * Prose content (description, artistStatement, lessonsLearned, timeline milestones)
 * is internationalised via src/i18n/en.json + vi.json under the "projects" namespace.
 * Fields are kept on the interface as empty-string fallbacks to maintain backward
 * compatibility with existing tests and typed consumers.
 *
 * Structure:
 *   slug       — used in URL routing: /projects/:slug
 *   name       — display title
 *   techStack  — rendered as tag badges in gallery cards
 *   demoUrl    — live demo link (null if not applicable)
 *   repoUrl    — GitHub source link (null if not applicable)
 *   timeline.milestones — sorted by date automatically; title/description come from i18n
 *   hasBuildStory — enables "View Build Story" link on detail page
 *   availability — used to filter "available" projects in getAvailableProjects()
 */

export interface TimelineMilestone {
  date: string // ISO 8601: YYYY-MM-DD
  /** i18n key suffix — renders t('projects.{slug}.timeline.{key}.title/description') */
  key: string
}

export type ProjectAvailability = 'available' | 'not-available' | 'open-to-roles'

export interface ProjectMetrics {
  shipDays?: number
  uptimeDays?: number
}

export interface ProjectProofPoint {
  icon: string      // emoji icon
  text: string       // short label (≤20 chars)
}

export interface Project {
  slug: string
  name: string
  /** Alias for name — used by existing gallery components */
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
  status: 'live' | 'building' | 'archived'
  /** Appears in the "Featured" filter tab */
  featured?: boolean
  /** Static build metrics shown on the card */
  metrics?: ProjectMetrics
  /** Opt-out of WebSocket live metrics section (for internal/company projects) */
  hasLiveMetrics?: boolean
  /** Alias for techStack — used by existing gallery components */
  tags: string[]
  /** Alias for demoUrl — used by existing card components */
  liveUrl?: string
  /** Alias for repoUrl — used by existing card components */
  githubUrl?: string
  /** Source of truth: i18n. */
  lessonsLearned?: string
  /** Production scale indicators — shown below description */
  proofPoints?: ProjectProofPoint[]
}

// ---------------------------------------------------------------------------
// Config entries — real data reflecting Chính's actual background
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  // 1. sapo-social-channel — archived, featured
  {
    slug: 'sapo-social-channel',
    name: 'Sapo Social Channel',
    title: 'Sapo Social Channel',
    description: '', // i18n: projects.sapo-social-channel.description
    techStack: ['ReactJS', 'Java Spring Boot', 'MongoDB', 'Kafka', 'RabbitMQ', 'Redux', 'Grafana'],
    tags: ['ReactJS', 'Java Spring Boot', 'MongoDB', 'Kafka', 'RabbitMQ', 'Redux', 'Grafana'],
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
    status: 'archived',
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

  // 2. facebook-shopping — archived, featured
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
    status: 'archived',
    featured: true,
    metrics: undefined,
    hasLiveMetrics: false,
    lessonsLearned: '', // i18n: projects.facebook-shopping.lessonsLearned
    proofPoints: [
      { icon: '🔗', text: 'Meta API integration' },
      { icon: '📦', text: 'Catalog sync engine' },
    ],
  },

  // 3. wallet-app — live, featured
  {
    slug: 'wallet-app',
    name: 'Wallet App',
    title: 'Wallet App',
    description: '', // i18n: projects.wallet-app.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    demoUrl: 'https://wallet.chinh.dev',
    repoUrl: 'https://github.com/chinh-dev11/wallet-app',
    liveUrl: 'https://wallet.chinh.dev',
    githubUrl: 'https://github.com/chinh-dev11/wallet-app',
    artistStatement: '', // i18n: projects.wallet-app.artistStatement
    timeline: {
      milestones: [
        { date: '2025-08-01', key: 'm1' },
        { date: '2025-09-01', key: 'm2' },
        { date: '2025-10-01', key: 'm3' },
      ],
    },
    hasBuildStory: false,
    availability: 'available',
    status: 'live',
    featured: true,
    metrics: { shipDays: 60, uptimeDays: 150 },
    lessonsLearned: '', // i18n: projects.wallet-app.lessonsLearned
    proofPoints: [
      { icon: '🔐', text: 'JWT + OAuth2' },
      { icon: '🔄', text: 'Token refresh flow' },
      { icon: '💰', text: 'Live at wallet.chinh.dev' },
    ],
  },

  // 4. portfolio-v2 — building, featured
  {
    slug: 'portfolio-v2',
    name: 'Portfolio v2',
    title: 'Portfolio v2',
    description: '', // i18n: projects.portfolio-v2.description
    techStack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'GitHub Actions'],
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'GitHub Actions'],
    demoUrl: null,
    repoUrl: 'https://github.com/chinh-dev11/portfolio-v2',
    liveUrl: undefined,
    githubUrl: 'https://github.com/chinh-dev11/portfolio-v2',
    artistStatement: '', // i18n: projects.portfolio-v2.artistStatement
    timeline: {
      milestones: [
        { date: '2026-03-07', key: 'm1' },
        { date: '2026-03-13', key: 'm2' },
      ],
    },
    hasBuildStory: false,
    availability: 'open-to-roles',
    status: 'building',
    featured: true,
    metrics: { shipDays: 13, uptimeDays: 7 },
    lessonsLearned: '', // i18n: projects.portfolio-v2.lessonsLearned
    proofPoints: [
      { icon: '🤖', text: 'AI-augmented SDLC' },
      { icon: '🧪', text: '222 passing tests' },
      { icon: '🚀', text: 'CI/CD day 13' },
    ],
  },

  // 5. sapo-social-mobile — archived, not featured
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
    status: 'archived',
    featured: false,
    metrics: undefined,
    lessonsLearned: '', // i18n: projects.sapo-social-mobile.lessonsLearned
    proofPoints: [
      { icon: '📱', text: 'React Native' },
      { icon: '🔄', text: 'Offline-first cache' },
    ],
  },

  // 6. hospital-website — archived, not featured
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
    status: 'archived',
    featured: false,
    metrics: undefined,
    lessonsLearned: '', // i18n: projects.hospital-website.lessonsLearned
    proofPoints: [
      { icon: '⚖️', text: 'Load balancing' },
      { icon: '🗄️', text: 'nginx production' },
      { icon: '🎓', text: 'Graduation thesis' },
    ],
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

/**
 * Typed about / availability config
 *
 * AC: #3 — Update availability.status or availability.location here and the
 * job availability badge reflects the change on next deploy with no component
 * code changes.
 */

export type AvailabilityStatus = 'available' | 'not-available' | 'open-to-roles'

export interface Availability {
  status: AvailabilityStatus
  location: string // e.g. "Ho Chi Minh City, Vietnam"
}

export interface SkillWithProof {
  tech: string
  version: string
  projectSlug: string // must match a slug in src/config/projects.ts
}

export interface AboutConfig {
  whyHireMe: string
  skills: SkillWithProof[]
  availability: Availability
}

/** Map of status key → human-readable label (used by i18n key lookup) */
export const STATUS_KEY: Record<AvailabilityStatus, string> = {
  'available': 'open',
  'not-available': 'unavailable',
  'open-to-roles': 'selective',
}

/** CSS colour for each availability status (green / grey / amber) */
export const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  'available': '#22C55E',
  'not-available': '#6B7280',
  'open-to-roles': '#EAB308',
}

export const aboutConfig: AboutConfig = {
  whyHireMe:
    "I'm an AI-augmented Fullstack Engineer — not in the 'I use Copilot' sense, but in the 'AI is a first-class tool in every phase of my workflow' sense. I use AI to draft specs, generate tests, catch edge cases, and keep my output consistent at scale. The result: 216+ passing tests, CI/CD on day 13, and a portfolio that's honest about what I've built and how I built it. I'm looking for a team that values shipping with quality over shipping with noise.",

  skills: [
    { tech: 'React', version: '18', projectSlug: 'sapo-social-channel' },
    { tech: 'TypeScript', version: '5', projectSlug: 'facebook-shopping' },
    { tech: 'Spring Boot', version: '3.x', projectSlug: 'sapo-social-channel' },
    { tech: 'React Native', version: 'latest', projectSlug: 'sapo-social-mobile' },
    { tech: 'Java', version: '21', projectSlug: 'wallet-app' },
    { tech: 'PostgreSQL', version: '16', projectSlug: 'wallet-app' },
    { tech: 'MongoDB', version: 'latest', projectSlug: 'sapo-social-channel' },
    { tech: 'CI/CD', version: 'GitHub Actions', projectSlug: 'portfolio-v2' },
    { tech: 'Kafka', version: 'latest', projectSlug: 'sapo-social-channel' },
  ],

  availability: {
    status: 'open-to-roles',
    location: 'Hà Nội · Remote',
  },
}

/** Returns the current availability object. */
export const getAvailability = (): Availability => aboutConfig.availability
