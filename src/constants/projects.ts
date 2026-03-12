export interface ProjectConfig {
  slug: string
  title: string
  description: string        // ≤ 80 chars for gallery card display
  tags: string[]             // Tech stack used for FilterChip generation + card display
  status: 'live' | 'building' | 'archived'
  featured?: boolean         // true = appears in "Featured" filter tab
  githubUrl?: string
  liveUrl?: string
  metrics?: {
    shipDays?: number        // Days from first commit to first production deploy
    uptimeDays?: number      // Consecutive days of uptime
  }
  artistStatement?: string   // The WHY behind the project (for ProjectDetailPage)
  buildTimelineStart?: string // "YYYY-MM" first commit month
  buildTimelineEnd?: string   // "YYYY-MM" production deploy month (undefined if in progress)
  lessonsLearned?: string     // "What I'd do differently" content (collapsible)
  timeline?: {
    milestones: Array<{
      label: string  // e.g. "First Commit", "MVP Complete", "Production Deploy"
      date: string   // ISO date: "YYYY-MM-DD"
    }>
  }
}

export const projects: ProjectConfig[] = [
  {
    slug: 'portfolio-v2',
    title: 'Portfolio v2',
    description: 'Production-ready portfolio with live metrics, i18n, and WebSocket integration.',
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket'],
    status: 'building',
    featured: true,
    githubUrl: 'https://github.com/chinh-dev11/portfolio-v2',
    metrics: {
      shipDays: 30,
    },
    artistStatement:
      'Built to demonstrate production-grade engineering — not just polished UI, but live infrastructure, CI/CD, and real observability. The old version was patchy; this one is built to last.',
    buildTimelineStart: '2026-02',
    lessonsLearned:
      'I would have invested in the design system upfront instead of retrofitting tokens. Building the component library first would have prevented multiple rounds of refactoring.',
    timeline: {
      milestones: [
        { label: 'First Commit', date: '2026-02-01' },
        { label: 'App Shell + Design System', date: '2026-02-15' },
        { label: 'Project Gallery & Hero', date: '2026-03-05' },
      ],
    },
  },
  {
    slug: 'wallet-app',
    title: 'Wallet App',
    description: 'Fintech demo with Google OAuth2, transaction tracking, and JWT auth.',
    tags: ['React', 'Spring Boot', 'PostgreSQL', 'JWT', 'OAuth2'],
    status: 'live',
    featured: true,
    githubUrl: 'https://github.com/chinh-dev11/wallet-app',
    liveUrl: 'https://wallet.chinh.dev',
    metrics: {
      shipDays: 47,
      uptimeDays: 90,
    },
    artistStatement:
      'Built to prove I can ship a real auth system with proper security — not just a demo that breaks in prod. Every OAuth2 edge case handled, every JWT rotation covered.',
    buildTimelineStart: '2025-10',
    buildTimelineEnd: '2025-12',
    lessonsLearned:
      'I would have built the token refresh flow as a separate service from day one. Tangling it with the main auth flow caused painful refactoring in week 3. Separation of concerns from the start.',
    timeline: {
      milestones: [
        { label: 'First Commit', date: '2025-10-01' },
        { label: 'Google OAuth2 Integration', date: '2025-11-01' },
        { label: 'Production Deploy', date: '2025-12-15' },
      ],
    },
  },
  {
    slug: 'portfolio-v1',
    title: 'Portfolio v1',
    description: 'First portfolio iteration: React frontend + Java Spring Boot + MongoDB backend.',
    tags: ['React', 'TypeScript', 'Spring Boot', 'MongoDB'],
    status: 'archived',
    featured: false,
    githubUrl: 'https://github.com/chinh-dev11/portfolio',
    metrics: {
      shipDays: 60,
    },
    artistStatement:
      'My first attempt at a full-stack portfolio. Buggy and patchy in hindsight — but it taught me everything I needed to build v2 properly.',
    buildTimelineStart: '2025-06',
    buildTimelineEnd: '2025-09',
    lessonsLearned:
      "I should have defined the data model before touching the UI. I ended up changing the MongoDB schema three times, which broke the frontend each time. Schema-first development is the lesson.",
    timeline: {
      milestones: [
        { label: 'First Commit', date: '2025-06-01' },
        { label: 'Backend API Complete', date: '2025-08-01' },
        { label: 'Production Deploy', date: '2025-09-15' },
      ],
    },
  },
]
