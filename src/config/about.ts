/**
 * Typed about / availability config
 *
 * AC: #3 — Update availability.status or availability.location here and the
 * job availability badge reflects the change on next deploy with no component
 * code changes.
 */

// ---------------------------------------------------------------------------
// Hero Stats Bar types (Story 6.6)
// ---------------------------------------------------------------------------

export interface HeroStat {
  icon: string      // emoji — used as accessible label prefix
  label: string     // primary text
  sublabel?: string // secondary text below (optional)
  tooltip?: string  // longer explanation (aria-label)
}

export const HERO_STATS: HeroStat[] = [
  {
    icon: '🏗️',
    label: '4 yrs',
    sublabel: '@ Sapo Technology',
    tooltip: 'Fullstack Developer 2022–2026: Social Channel, Facebook Shopping, Mobile',
  },
  {
    icon: '⚡',
    label: 'Node 14→18',
    sublabel: 'Led major upgrade',
    tooltip: 'Led runtime upgrade from Node.js 14 to 18 across the Sapo platform',
  },
  {
    icon: '⚛️',
    label: 'React 16→18',
    sublabel: 'Architecture migration',
    tooltip: 'Led React ecosystem upgrade, resolving hydration issues and enabling concurrent features',
  },
  {
    icon: '🚀',
    label: '13 days',
    sublabel: 'to production',
    tooltip: 'Portfolio v2: first commit to live production deploy in 13 days with AI-augmented SDLC',
  },
  {
    icon: '🧪',
    label: '222 tests',
    sublabel: '0 lint errors',
    tooltip: 'Full test coverage across all components with zero lint violations',
  },
]

// ---------------------------------------------------------------------------
// AI Workflow Strip types (Story 6.6)
// ---------------------------------------------------------------------------

export interface AIWorkflowStep {
  icon: string
  label: string
  sublabel: string
  ariaLabel: string
}

export const AI_WORKFLOW_STEPS: AIWorkflowStep[] = [
  {
    icon: '📋',
    label: 'Spec',
    sublabel: 'AI drafts structure',
    ariaLabel: 'Planning: AI assists with spec drafting and requirements analysis',
  },
  {
    icon: '⌨️',
    label: 'Code',
    sublabel: 'AI pair-programming',
    ariaLabel: 'Implementation: AI acts as pair programmer, Chinh drives decisions',
  },
  {
    icon: '🧪',
    label: 'Test',
    sublabel: 'AI generates coverage',
    ariaLabel: 'Testing: AI generates unit and integration tests, Chinh reviews',
  },
  {
    icon: '🚀',
    label: 'Deploy',
    sublabel: 'CI/CD validates',
    ariaLabel: 'Deploy: CI/CD pipeline validates every change before production',
  },
]

// ---------------------------------------------------------------------------
// Availability types
// ---------------------------------------------------------------------------

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
