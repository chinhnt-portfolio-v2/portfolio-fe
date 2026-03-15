import { act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import { useReferralStore } from './referralStore'

describe('useReferralStore', () => {
  let originalLocation: Location
  let originalLocalStorage: Storage

  beforeEach(() => {
    originalLocation = window.location
    originalLocalStorage = window.localStorage

    act(() => {
      useReferralStore.setState({ referralSource: null, _hasHydrated: false })
    })
  })

  afterEach(() => {
    window.location = originalLocation
    window.localStorage = originalLocalStorage
  })

  it('initializes with null referral source', () => {
    expect(useReferralStore.getState().referralSource).toBeNull()
  })

  it('setReferralSource stores the source', () => {
    act(() => {
      useReferralStore.getState().setReferralSource('linkedin')
    })
    expect(useReferralStore.getState().referralSource).toBe('linkedin')
  })

  it('setReferralSource can be updated to a new source', () => {
    act(() => {
      useReferralStore.getState().setReferralSource('linkedin')
      useReferralStore.getState().setReferralSource('github')
    })
    expect(useReferralStore.getState().referralSource).toBe('github')
  })

  describe('URL parameter parsing', () => {
    it('reads from ?from= parameter on initialization', () => {
      vi.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key: string) => {
        if (key === 'from') return 'linkedin'
        return null
      })

      act(() => {
        useReferralStore.setState({ _hasHydrated: true })
        useReferralStore.getState().initializeFromUrl()
      })

      expect(useReferralStore.getState().referralSource).toBe('linkedin')

      vi.restoreAllMocks()
    })

    it('does not override existing referral source from persistence', () => {
      act(() => {
        useReferralStore.setState({ referralSource: 'github', _hasHydrated: true })
        useReferralStore.getState().initializeFromUrl()
      })

      expect(useReferralStore.getState().referralSource).toBe('github')
    })

    it('handles missing ?from= parameter gracefully', () => {
      vi.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(null)

      act(() => {
        useReferralStore.setState({ _hasHydrated: true })
        useReferralStore.getState().initializeFromUrl()
      })

      expect(useReferralStore.getState().referralSource).toBeNull()

      vi.restoreAllMocks()
    })

    it('handles URL parsing errors gracefully', () => {
      vi.spyOn(URLSearchParams.prototype, 'get').mockImplementation(() => {
        throw new Error('URL parsing error')
      })

      act(() => {
        useReferralStore.setState({ _hasHydrated: true })
        useReferralStore.getState().initializeFromUrl()
      })

      expect(useReferralStore.getState().referralSource).toBeNull()

      vi.restoreAllMocks()
    })
  })

  describe('hydration state', () => {
    it('tracks hydration state', () => {
      expect(useReferralStore.getState()._hasHydrated).toBe(false)

      act(() => {
        useReferralStore.getState().setHasHydrated(true)
      })

      expect(useReferralStore.getState()._hasHydrated).toBe(true)
    })

    it('initializeFromUrl does nothing before hydration', () => {
      act(() => {
        useReferralStore.setState({ _hasHydrated: false })
        useReferralStore.getState().initializeFromUrl()
      })

      expect(useReferralStore.getState().referralSource).toBeNull()
    })
  })

  describe('localStorage failure handling', () => {
    it('handles localStorage.getItem throwing (private browsing)', async () => {
      const mockStorage = {
        getItem: vi.fn(() => {
          throw new Error('QuotaExceededError')
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      }
      vi.stubGlobal('localStorage', mockStorage)

      // Store should still work - state is in memory
      act(() => {
        useReferralStore.getState().setReferralSource('linkedin')
      })
      expect(useReferralStore.getState().referralSource).toBe('linkedin')

      vi.unstubAllGlobals()
    })

    it('handles localStorage.setItem throwing (private browsing)', async () => {
      const mockStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw new Error('QuotaExceededError')
        }),
        removeItem: vi.fn(),
      }
      vi.stubGlobal('localStorage', mockStorage)

      // Store should still work - state is in memory
      act(() => {
        useReferralStore.getState().setReferralSource('linkedin')
      })
      expect(useReferralStore.getState().referralSource).toBe('linkedin')

      vi.unstubAllGlobals()
    })

    it('continues to work when localStorage is completely unavailable', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      })

      // Store should still initialize and work
      expect(useReferralStore.getState()).toBeDefined()
      expect(typeof useReferralStore.getState().setReferralSource).toBe('function')

      window.localStorage = originalLocalStorage
    })
  })
})
