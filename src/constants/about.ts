export type AvailabilityStatus = 'open' | 'selective' | 'unavailable'

export interface SkillWithProof {
  tech: string
  version: string
  projectSlug: string // must match a slug in projects.ts
}

export interface AboutConfig {
  whyHireMe: string
  skills: SkillWithProof[]
  availability: {
    status: AvailabilityStatus
    location: string
  }
}

export const STATUS_LABEL: Record<AvailabilityStatus, string> = {
  open: 'Open to Work',
  selective: 'Selectively Looking',
  unavailable: 'Not Available',
}

export const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  open: '#22C55E',
  selective: '#EAB308',
  unavailable: '#6B7280',
}

export const aboutContent: AboutConfig = {
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
    status: 'open',
    location: 'Remote · Ho Chi Minh City',
  },
}
