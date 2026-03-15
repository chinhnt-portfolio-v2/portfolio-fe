import { act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import { useReturnVisitorStore } from './returnVisitorStore'

describe('useReturnVisitorStore', () => {
  let originalLocalStorage: Storage

  beforeEach(() => {
    originalLocalStorage = window.localStorage
    localStorage.clear()

    act(() => {
      useReturnVisitorStore.setState({
        lastViewedSlug: null,
        lastViewedTab: null,
        lastVisitTimestamp: null,
        bannerDismissed: false,
        _hasHydrated: false,
      })
    })
  })

  afterEach(() => {
    window.localStorage = originalLocalStorage
    localStorage.clear()
  })

  describe('initialization', () => {
    it('initializes with null values', () => {
      const state = useReturnVisitorStore.getState()
      expect(state.lastViewedSlug).toBeNull()
      expect(state.lastViewedTab).toBeNull()
      expect(state.lastVisitTimestamp).toBeNull()
      expect(state.bannerDismissed).toBe(false)
    })

    it('has hydration state initially false', () => {
      expect(useReturnVisitorStore.getState()._hasHydrated).toBe(false)
    })
  })

  describe('setLastViewedSlug', () => {
    it('sets the last viewed slug', () => {
      act(() => {
        useReturnVisitorStore.getState().setLastViewedSlug('wallet-app')
      })
      expect(useReturnVisitorStore.getState().lastViewedSlug).toBe('wallet-app')
    })

    it('can set slug to null', () => {
      act(() => {
        useReturnVisitorStore.getState().setLastViewedSlug('wallet-app')
        useReturnVisitorStore.getState().setLastViewedSlug(null)
      })
      expect(useReturnVisitorStore.getState().lastViewedSlug).toBeNull()
    })
  })

  describe('setLastViewedTab', () => {
    it('sets the last viewed tab to featured', () => {
      act(() => {
        useReturnVisitorStore.getState().setLastViewedTab('featured')
      })
      expect(useReturnVisitorStore.getState().lastViewedTab).toBe('featured')
    })

    it('sets the last viewed tab to technical', () => {
      act(() => {
        useReturnVisitorStore.getState().setLastViewedTab('technical')
      })
      expect(useReturnVisitorStore.getState().lastViewedTab).toBe('technical')
    })
  })

  describe('dismissBanner', () => {
    it('sets bannerDismissed to true', () => {
      act(() => {
        useReturnVisitorStore.getState().dismissBanner()
      })
      expect(useReturnVisitorStore.getState().bannerDismissed).toBe(true)
    })
  })

  describe('updateTimestamp', () => {
    it('sets lastVisitTimestamp to current time', () => {
      const before = Date.now()
      act(() => {
        useReturnVisitorStore.getState().updateTimestamp()
      })
      const after = Date.now()

      const timestamp = useReturnVisitorStore.getState().lastVisitTimestamp
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })

    it('updates timestamp on each call', () => {
      act(() => {
        useReturnVisitorStore.getState().updateTimestamp()
      })
      const firstTimestamp = useReturnVisitorStore.getState().lastVisitTimestamp

      // Wait a tiny bit to ensure different timestamp
      vi.useFakeTimers()
      vi.advanceTimersByTime(100)

      act(() => {
        useReturnVisitorStore.getState().updateTimestamp()
      })

      expect(useReturnVisitorStore.getState().lastVisitTimestamp).toBeGreaterThan(firstTimestamp!)
      vi.useRealTimers()
    })
  })

  describe('isReturningVisitor', () => {
    it('returns false when lastViewedSlug is null', () => {
      act(() => {
        useReturnVisitorStore.setState({ lastViewedSlug: null })
      })
      expect(useReturnVisitorStore.getState().isReturningVisitor()).toBe(false)
    })

    it('returns false when lastViewedSlug is empty string', () => {
      act(() => {
        useReturnVisitorStore.setState({ lastViewedSlug: '' })
      })
      expect(useReturnVisitorStore.getState().isReturningVisitor()).toBe(false)
    })

    it('returns true when lastViewedSlug is set', () => {
      act(() => {
        useReturnVisitorStore.setState({ lastViewedSlug: 'wallet-app' })
      })
      expect(useReturnVisitorStore.getState().isReturningVisitor()).toBe(true)
    })
  })

  describe('persistence', () => {
    // Note: Zustand persist middleware handles localStorage sync automatically.
    // Testing actual persistence requires integration tests with a real store instance.
    // These tests verify the store methods work correctly in isolation.
    it('store has correct initial state structure', () => {
      const state = useReturnVisitorStore.getState()
      expect(state).toHaveProperty('lastViewedSlug')
      expect(state).toHaveProperty('lastViewedTab')
      expect(state).toHaveProperty('lastVisitTimestamp')
      expect(state).toHaveProperty('bannerDismissed')
      expect(state).toHaveProperty('_hasHydrated')
    })
  })

  describe('localStorage failure handling', () => {
    it('handles localStorage.getItem throwing (private browsing)', () => {
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
        useReturnVisitorStore.getState().setLastViewedSlug('test')
      })
      expect(useReturnVisitorStore.getState().lastViewedSlug).toBe('test')

      vi.unstubAllGlobals()
    })

    it('handles localStorage.setItem throwing (private browsing)', () => {
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
        useReturnVisitorStore.getState().setLastViewedSlug('test')
      })
      expect(useReturnVisitorStore.getState().lastViewedSlug).toBe('test')

      vi.unstubAllGlobals()
    })

    it('continues to work when localStorage is completely unavailable', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      })

      // Store should still initialize and work
      expect(useReturnVisitorStore.getState()).toBeDefined()
      expect(typeof useReturnVisitorStore.getState().setLastViewedSlug).toBe('function')

      window.localStorage = originalLocalStorage
    })
  })

  describe('setHasHydrated', () => {
    it('sets hydration state to true', () => {
      act(() => {
        useReturnVisitorStore.getState().setHasHydrated(true)
      })
      expect(useReturnVisitorStore.getState()._hasHydrated).toBe(true)
    })
  })
})
