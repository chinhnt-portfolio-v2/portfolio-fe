import { act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { useLanguageStore } from './languageStore'
import { useReferralStore } from './referralStore'

describe('useLanguageStore', () => {
  let originalLocalStorage: Storage

  beforeEach(() => {
    originalLocalStorage = window.localStorage
    act(() => {
      useLanguageStore.setState({ language: 'en', _hasHydrated: false })
      useReferralStore.setState({ referralSource: null, _hasHydrated: false })
    })
  })

  afterEach(() => {
    window.localStorage = originalLocalStorage
  })

  it('initializes with English', () => {
    expect(useLanguageStore.getState().language).toBe('en')
  })

  it('setLanguage switches to Vietnamese', () => {
    act(() => {
      useLanguageStore.getState().setLanguage('vi')
    })
    expect(useLanguageStore.getState().language).toBe('vi')
  })

  it('setLanguage switches back to English', () => {
    act(() => {
      useLanguageStore.getState().setLanguage('vi')
      useLanguageStore.getState().setLanguage('en')
    })
    expect(useLanguageStore.getState().language).toBe('en')
  })

  describe('auto-set from referral', () => {
    it('auto-sets to English when referral is linkedin', () => {
      act(() => {
        useLanguageStore.setState({ language: 'en', _hasHydrated: true })
        useReferralStore.setState({ referralSource: 'linkedin', _hasHydrated: true })
        useLanguageStore.getState().autoSetFromReferral()
      })

      expect(useLanguageStore.getState().language).toBe('en')
    })

    it('auto-sets to Vietnamese when referral is cv-vn', () => {
      act(() => {
        useLanguageStore.setState({ language: 'en', _hasHydrated: true })
        useReferralStore.setState({ referralSource: 'cv-vn', _hasHydrated: true })
        useLanguageStore.getState().autoSetFromReferral()
      })

      expect(useLanguageStore.getState().language).toBe('vi')
    })

    it('does not override manual language preference', () => {
      act(() => {
        // User manually set to Vietnamese
        useLanguageStore.setState({ language: 'vi', _hasHydrated: true })
        useReferralStore.setState({ referralSource: 'linkedin', _hasHydrated: true })
        useLanguageStore.getState().autoSetFromReferral()
      })

      // Should NOT override manual Vietnamese preference with English
      expect(useLanguageStore.getState().language).toBe('vi')
    })

    it('does nothing before hydration', () => {
      act(() => {
        useLanguageStore.setState({ language: 'en', _hasHydrated: false })
        useReferralStore.setState({ referralSource: 'cv-vn', _hasHydrated: true })
        useLanguageStore.getState().autoSetFromReferral()
      })

      // Should NOT switch because not hydrated yet
      expect(useLanguageStore.getState().language).toBe('en')
    })

    it('does nothing when referral source is not recognized', () => {
      act(() => {
        useLanguageStore.setState({ language: 'en', _hasHydrated: true })
        useReferralStore.setState({ referralSource: 'unknown', _hasHydrated: true })
        useLanguageStore.getState().autoSetFromReferral()
      })

      expect(useLanguageStore.getState().language).toBe('en')
    })

    it('does nothing when no referral source exists', () => {
      act(() => {
        useLanguageStore.setState({ language: 'en', _hasHydrated: true })
        useReferralStore.setState({ referralSource: null, _hasHydrated: true })
        useLanguageStore.getState().autoSetFromReferral()
      })

      expect(useLanguageStore.getState().language).toBe('en')
    })
  })

  describe('hydration state', () => {
    it('tracks hydration state', () => {
      expect(useLanguageStore.getState()._hasHydrated).toBe(false)

      act(() => {
        useLanguageStore.getState().setHasHydrated(true)
      })

      expect(useLanguageStore.getState()._hasHydrated).toBe(true)
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
      // The safe storage wrapper catches the error so app doesn't crash
      act(() => {
        useLanguageStore.getState().setLanguage('vi')
      })
      expect(useLanguageStore.getState().language).toBe('vi')

      // Verify store methods work despite storage errors
      act(() => {
        useLanguageStore.getState().setLanguage('en')
      })
      expect(useLanguageStore.getState().language).toBe('en')

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
        useLanguageStore.getState().setLanguage('vi')
      })
      expect(useLanguageStore.getState().language).toBe('vi')

      // Verify store still updates in memory even if persist fails
      act(() => {
        useLanguageStore.getState().setLanguage('en')
      })
      expect(useLanguageStore.getState().language).toBe('en')

      vi.unstubAllGlobals()
    })

    it('continues to work when localStorage is completely unavailable', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      })

      // Store should still initialize and work
      expect(useLanguageStore.getState()).toBeDefined()
      expect(typeof useLanguageStore.getState().setLanguage).toBe('function')

      // Store operations should work in memory
      act(() => {
        useLanguageStore.getState().setLanguage('vi')
      })
      expect(useLanguageStore.getState().language).toBe('vi')

      window.localStorage = originalLocalStorage
    })
  })
})
