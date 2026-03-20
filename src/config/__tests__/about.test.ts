import { describe, it, expect } from 'vitest'

import {
  aboutConfig,
  getAvailability,
  STATUS_COLOR,
  STATUS_KEY,
  type AvailabilityStatus,
} from '../about'

describe('aboutConfig', () => {
  it('has a non-empty whyHireMe string', () => {
    expect(typeof aboutConfig.whyHireMe).toBe('string')
    expect(aboutConfig.whyHireMe.length).toBeGreaterThan(0)
  })

  it('has a non-empty skills array', () => {
    expect(Array.isArray(aboutConfig.skills)).toBe(true)
    expect(aboutConfig.skills.length).toBeGreaterThan(0)
  })

  it('each skill has tech, version, and projectSlug', () => {
    for (const skill of aboutConfig.skills) {
      expect(typeof skill.tech).toBe('string')
      expect(skill.tech.length).toBeGreaterThan(0)
      expect(typeof skill.version).toBe('string')
      expect(skill.version.length).toBeGreaterThan(0)
      expect(typeof skill.projectSlug).toBe('string')
      expect(skill.projectSlug.length).toBeGreaterThan(0)
    }
  })

  it('availability.status is a valid AvailabilityStatus value', () => {
    const valid: AvailabilityStatus[] = ['available', 'not-available', 'open-to-roles']
    expect(valid).toContain(aboutConfig.availability.status)
  })

  it('availability.location is a non-empty string', () => {
    expect(typeof aboutConfig.availability.location).toBe('string')
    expect(aboutConfig.availability.location.length).toBeGreaterThan(0)
  })
})

describe('getAvailability()', () => {
  it('returns the availability object from aboutConfig', () => {
    const availability = getAvailability()
    expect(availability).toEqual(aboutConfig.availability)
  })

  it('returns an object with status and location', () => {
    const { status, location } = getAvailability()
    expect(typeof status).toBe('string')
    expect(typeof location).toBe('string')
  })
})

describe('STATUS_COLOR', () => {
  it('has a color entry for every valid availability status', () => {
    const statuses: AvailabilityStatus[] = ['available', 'not-available', 'open-to-roles']
    for (const status of statuses) {
      expect(STATUS_COLOR[status]).toBeDefined()
      expect(typeof STATUS_COLOR[status]).toBe('string')
      expect(STATUS_COLOR[status].length).toBeGreaterThan(0)
    }
  })

  it('available maps to green (#22C55E)', () => {
    expect(STATUS_COLOR['available']).toBe('#22C55E')
  })

  it('not-available maps to grey (#6B7280)', () => {
    expect(STATUS_COLOR['not-available']).toBe('#6B7280')
  })

  it('open-to-roles maps to amber (#EAB308)', () => {
    expect(STATUS_COLOR['open-to-roles']).toBe('#EAB308')
  })
})

describe('STATUS_KEY — i18n key mapping', () => {
  it('available maps to "open" (i18n key)', () => {
    expect(STATUS_KEY['available']).toBe('open')
  })

  it('not-available maps to "unavailable" (i18n key)', () => {
    expect(STATUS_KEY['not-available']).toBe('unavailable')
  })

  it('open-to-roles maps to "selective" (i18n key)', () => {
    expect(STATUS_KEY['open-to-roles']).toBe('selective')
  })
})
