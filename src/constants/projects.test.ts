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
      expect(p.description).toBeTruthy()
      expect(p.tags).toBeInstanceOf(Array)
      expect(p.tags.length).toBeGreaterThan(0)
      expect(['live', 'building', 'archived']).toContain(p.status)
    })
  })

  it('description is ≤ 80 characters for each project', () => {
    projects.forEach((p: ProjectConfig) => {
      expect(p.description.length).toBeLessThanOrEqual(80)
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

  it('every project has lessonsLearned populated', () => {
    projects.forEach((p: ProjectConfig) => {
      expect(p.lessonsLearned).toBeDefined()
      expect(typeof p.lessonsLearned).toBe('string')
      expect((p.lessonsLearned as string).length).toBeGreaterThan(0)
    })
  })

  it('every project has at least 2 timeline milestones', () => {
    projects.forEach((p: ProjectConfig) => {
      expect(p.timeline).toBeDefined()
      expect(p.timeline?.milestones.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('timeline milestones have label and ISO date fields', () => {
    projects.forEach((p: ProjectConfig) => {
      p.timeline?.milestones.forEach(m => {
        expect(typeof m.label).toBe('string')
        expect(m.label.length).toBeGreaterThan(0)
        expect(/^\d{4}-\d{2}-\d{2}$/.test(m.date)).toBe(true)
      })
    })
  })
})
