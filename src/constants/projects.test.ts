import { describe, it, expect } from 'vitest'

import { projects, type ProjectConfig } from './projects'

describe('projects data', () => {
  it('exports a non-empty array', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has required fields', () => {
    projects.forEach((p: ProjectConfig) => {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      // description/artistStatement/lessonsLearned: source of truth moved to i18n;
      // config fields kept as string (may be empty) for backward compatibility
      expect(typeof p.description).toBe('string')
      expect(p.tags).toBeInstanceOf(Array)
      expect(p.tags.length).toBeGreaterThan(0)
      expect(['live', 'building', 'archived']).toContain(p.status)
    })
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

  it('metrics.shipDays is a positive number when defined', () => {
    projects.forEach((p: ProjectConfig) => {
      if (p.metrics?.shipDays !== undefined) {
        expect(p.metrics.shipDays).toBeGreaterThan(0)
      }
    })
  })

  it('every project has at least 2 timeline milestones', () => {
    projects.forEach((p: ProjectConfig) => {
      expect(p.timeline).toBeDefined()
      expect(p.timeline?.milestones.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('timeline milestones have ISO date and i18n key', () => {
    projects.forEach((p: ProjectConfig) => {
      p.timeline?.milestones.forEach(m => {
        // title/description moved to i18n; milestone now carries a `key` for lookup
        expect(typeof m.key).toBe('string')
        expect(m.key.length).toBeGreaterThan(0)
        expect(/^\d{4}-\d{2}-\d{2}$/.test(m.date)).toBe(true)
      })
    })
  })
})
