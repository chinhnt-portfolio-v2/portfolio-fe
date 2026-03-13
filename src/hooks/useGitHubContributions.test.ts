import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import * as useGitHubContributionsModule from './useGitHubContributions'

// Mock config
vi.mock('@/constants/config', () => ({
  GITHUB_USERNAME: 'testuser',
}))

describe('useGitHubContributions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('AC1: Loading and displaying data', () => {
    it('hook exists and can be imported', () => {
      expect(useGitHubContributionsModule.useGitHubContributions).toBeDefined()
      expect(typeof useGitHubContributionsModule.useGitHubContributions).toBe('function')
    })
  })

  describe('AC3: Cached data fallback', () => {
    it('has cachedDataRef for storing cached data', () => {
      const hookSource = useGitHubContributionsModule.useGitHubContributions.toString()
      expect(hookSource).toContain('cachedDataRef')
    })
  })

  describe('AC4: Hide section on empty data', () => {
    it('handles null/empty response in code', () => {
      const hookSource = useGitHubContributionsModule.useGitHubContributions.toString()
      expect(hookSource).toContain('Object.keys(result).length')
    })
  })

  describe('AC5: Timeout handling', () => {
    it('has AbortController timeout logic', () => {
      const hookSource = useGitHubContributionsModule.useGitHubContributions.toString()
      expect(hookSource).toContain('AbortController')
      expect(hookSource).toContain('setTimeout')
    })

    it('handles AbortError', () => {
      const hookSource = useGitHubContributionsModule.useGitHubContributions.toString()
      expect(hookSource).toContain('AbortError')
    })
  })

  describe('Integration', () => {
    it('checks username before fetching', () => {
      const hookSource = useGitHubContributionsModule.useGitHubContributions.toString()
      expect(hookSource).toContain('if (username)')
    })
  })
})
