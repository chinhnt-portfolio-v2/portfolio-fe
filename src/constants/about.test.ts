import { describe, it, expect } from 'vitest'

import { aboutContent, type AvailabilityStatus } from '@/constants/about'
import { projects } from '@/constants/projects'

describe('aboutContent', () => {
  it('has a non-empty whyHireMe string', () => {
    expect(typeof aboutContent.whyHireMe).toBe('string')
    expect(aboutContent.whyHireMe.length).toBeGreaterThan(0)
  })

  it('has a non-empty skills array', () => {
    expect(Array.isArray(aboutContent.skills)).toBe(true)
    expect(aboutContent.skills.length).toBeGreaterThan(0)
  })

  it('each skill has tech, version, and projectSlug', () => {
    for (const skill of aboutContent.skills) {
      expect(typeof skill.tech).toBe('string')
      expect(skill.tech.length).toBeGreaterThan(0)
      expect(typeof skill.version).toBe('string')
      expect(skill.version.length).toBeGreaterThan(0)
      expect(typeof skill.projectSlug).toBe('string')
      expect(skill.projectSlug.length).toBeGreaterThan(0)
    }
  })

  it('availability.status is a valid enum value', () => {
    const validStatuses: AvailabilityStatus[] = ['open', 'selective', 'unavailable', 'available', 'not-available', 'open-to-roles']
    expect(validStatuses).toContain(aboutContent.availability.status)
  })

  it('availability.location is a non-empty string', () => {
    expect(typeof aboutContent.availability.location).toBe('string')
    expect(aboutContent.availability.location.length).toBeGreaterThan(0)
  })

  it('each skill projectSlug resolves to an existing project', () => {
    const slugs = projects.map((p) => p.slug)
    for (const skill of aboutContent.skills) {
      expect(slugs).toContain(skill.projectSlug)
    }
  })
})
