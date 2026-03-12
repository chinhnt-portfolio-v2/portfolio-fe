import { formatRelativeTime } from './formatDate'

describe('formatRelativeTime', () => {
  it('returns "now" or equivalent for very recent dates', () => {
    const now = new Date().toISOString()
    const result = formatRelativeTime(now)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a relative time string for a past date', () => {
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
    const result = formatRelativeTime(yesterday)
    expect(result).toMatch(/yesterday|1 day ago|day/)
  })

  it('returns hour-based string for a date ~2 hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const result = formatRelativeTime(twoHoursAgo)
    expect(result).toMatch(/hour/)
  })

  it('returns minute-based string for a date ~5 minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const result = formatRelativeTime(fiveMinutesAgo)
    expect(result).toMatch(/minute/)
  })

  it('accepts a locale parameter', () => {
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
    const result = formatRelativeTime(yesterday, 'vi')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
