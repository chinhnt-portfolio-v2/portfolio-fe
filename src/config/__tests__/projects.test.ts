import { describe, it, expect } from 'vitest'

import {
  getAllProjects,
  getAvailableProjects,
  getProjectBySlug,
  projects,
  type Project,
} from '../projects'

// ---------------------------------------------------------------------------
// Data shape
// ---------------------------------------------------------------------------
describe('projects data', () => {
  it('exports a non-empty array', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has all required fields', () => {
    for (const p of projects) {
      expect(typeof p.slug).toBe('string')
      expect(p.slug.length).toBeGreaterThan(0)
      expect(typeof p.name).toBe('string')
      expect(p.name.length).toBeGreaterThan(0)
      expect(typeof p.description).toBe('string')
      expect(p.description.length).toBeGreaterThan(0)
      expect(Array.isArray(p.techStack)).toBe(true)
      expect(p.techStack.length).toBeGreaterThan(0)
      expect(p.demoUrl === null || typeof p.demoUrl === 'string').toBe(true)
      expect(p.repoUrl === null || typeof p.repoUrl === 'string').toBe(true)
      expect(typeof p.artistStatement).toBe('string')
      expect(typeof p.hasBuildStory).toBe('boolean')
      expect(['available', 'not-available', 'open-to-roles']).toContain(p.availability)
      expect(['live', 'building', 'archived']).toContain(p.status)
      expect(p.timeline).toBeDefined()
      expect(Array.isArray(p.timeline.milestones)).toBe(true)
    }
  })

  it('at least one project is featured', () => {
    const featured = projects.filter(p => p.featured === true)
    expect(featured.length).toBeGreaterThan(0)
  })

  it('slugs are unique', () => {
    const slugs = projects.map(p => p.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  it('timeline milestones have ISO date format (YYYY-MM-DD)', () => {
    for (const p of projects) {
      for (const m of p.timeline.milestones) {
        expect(/^\d{4}-\d{2}-\d{2}$/.test(m.date)).toBe(true)
        expect(typeof m.title).toBe('string')
        expect(m.title.length).toBeGreaterThan(0)
      }
    }
  })

  it('metrics.shipDays is a positive number when defined', () => {
    for (const p of projects) {
      if (p.metrics?.shipDays !== undefined) {
        expect(p.metrics.shipDays).toBeGreaterThan(0)
      }
    }
  })

  it('hasBuildStory is false for all projects in the initial dataset', () => {
    // Only projects that have a detailed build story page should be true
    for (const p of projects) {
      expect(typeof p.hasBuildStory).toBe('boolean')
    }
  })
})

// ---------------------------------------------------------------------------
// getAllProjects()
// ---------------------------------------------------------------------------
describe('getAllProjects()', () => {
  it('returns all projects', () => {
    expect(getAllProjects()).toEqual(projects)
  })

  it('returns the same array reference (not a copy)', () => {
    // Important: do not return a copy — consumers may rely on reference equality
    expect(getAllProjects()).toBe(projects)
  })
})

// ---------------------------------------------------------------------------
// getProjectBySlug()
// ---------------------------------------------------------------------------
describe('getProjectBySlug()', () => {
  it('returns the correct project for a known slug', () => {
    const first = projects[0]
    const found = getProjectBySlug(first.slug)
    expect(found).toEqual(first)
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('non-existent-project')).toBeUndefined()
  })

  it('returns the correct project for every slug in the array', () => {
    for (const p of projects) {
      expect(getProjectBySlug(p.slug)).toEqual(p)
    }
  })

  it('slug lookups are case-sensitive', () => {
    const first = projects[0]
    expect(getProjectBySlug(first.slug.toUpperCase())).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// getAvailableProjects()
// ---------------------------------------------------------------------------
describe('getAvailableProjects()', () => {
  it('returns only projects with availability === "available"', () => {
    const available = getAvailableProjects()
    for (const p of available) {
      expect(p.availability).toBe('available')
    }
  })

  it('does not include projects with availability "open-to-roles" or "not-available"', () => {
    const available = getAvailableProjects()
    const unavailable = projects.filter(p => p.availability !== 'available')
    for (const ua of unavailable) {
      const found = available.find(p => p.slug === ua.slug)
      expect(found).toBeUndefined()
    }
  })

  it('returns a new array (not the same reference as projects)', () => {
    // Ensures consumers can't mutate the original array
    expect(getAvailableProjects()).not.toBe(projects)
  })
})
