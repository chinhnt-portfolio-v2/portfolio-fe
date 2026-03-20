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
    'I build systems that are meant to stay running — not just demos that survive a presentation. ' +
    'My engineering philosophy is to make the invisible visible: instrumentation, CI/CD guardrails, and honest documentation of every architectural decision, including the wrong ones. ' +
    'I treat each project as a production system from day one, which means you get a developer who ships, monitors, and improves — not one who hands off and moves on.',
  skills: [
    { tech: 'React', version: '18', projectSlug: 'wallet-app' },
    { tech: 'TypeScript', version: '5', projectSlug: 'portfolio-v2' },
    { tech: 'Spring Boot', version: '3.4', projectSlug: 'wallet-app' },
    { tech: 'PostgreSQL', version: '16', projectSlug: 'wallet-app' },
    { tech: 'Java', version: '21', projectSlug: 'wallet-app' },
  ],
  availability: {
    status: 'open-to-roles',
    location: 'Remote · Ho Chi Minh City',
  },
}

/** Returns the current availability object. */
export const getAvailability = (): Availability => aboutConfig.availability
