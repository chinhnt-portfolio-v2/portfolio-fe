import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  detectInitialLanguage,
  getLanguageFromReferral,
  getLangFromUrlParam,
  parseReferralSource,
} from './referral'

describe('parseReferralSource', () => {
  it('returns the `from` param value when present', () => {
    expect(parseReferralSource('?from=linkedin')).toBe('linkedin')
  })

  it('returns null when `from` param is absent', () => {
    expect(parseReferralSource('?utm_source=google')).toBeNull()
  })

  it('returns null for empty query string', () => {
    expect(parseReferralSource('')).toBeNull()
  })

  it('handles multiple params and extracts `from` correctly', () => {
    expect(parseReferralSource('?utm_source=google&from=github&utm_medium=cpc')).toBe('github')
  })

  it('returns null when query string has no params', () => {
    expect(parseReferralSource('?')).toBeNull()
  })
})

describe('getLanguageFromReferral', () => {
  it('maps linkedin to en', () => {
    expect(getLanguageFromReferral('linkedin')).toBe('en')
  })

  it('maps cv-vn to vi', () => {
    expect(getLanguageFromReferral('cv-vn')).toBe('vi')
  })

  it('returns null for unknown sources', () => {
    expect(getLanguageFromReferral('github')).toBeNull()
    expect(getLanguageFromReferral('twitter')).toBeNull()
    expect(getLanguageFromReferral('unknown')).toBeNull()
  })

  it('returns null for null input', () => {
    expect(getLanguageFromReferral(null)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(getLanguageFromReferral('')).toBeNull()
  })
})

describe('getLangFromUrlParam', () => {
  it('returns vi for ?lang=vi', () => {
    expect(getLangFromUrlParam('?lang=vi')).toBe('vi')
  })

  it('returns en for ?lang=en', () => {
    expect(getLangFromUrlParam('?lang=en')).toBe('en')
  })

  it('returns null for invalid lang value', () => {
    expect(getLangFromUrlParam('?lang=fr')).toBeNull()
    expect(getLangFromUrlParam('?lang=zh')).toBeNull()
    expect(getLangFromUrlParam('?lang=')).toBeNull()
  })

  it('returns null when lang param is absent', () => {
    expect(getLangFromUrlParam('?from=linkedin')).toBeNull()
    expect(getLangFromUrlParam('')).toBeNull()
  })

  it('handles lang alongside other params', () => {
    expect(getLangFromUrlParam('?from=linkedin&lang=vi')).toBe('vi')
  })
})

describe('detectInitialLanguage', () => {
  const originalNavigator = global.navigator

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
  })

  it('priority 1: ?lang= param overrides everything', () => {
    // Even with localStorage set to 'en', ?lang=vi wins
    localStorage.setItem(
      'language-preference',
      JSON.stringify({ state: { language: 'en' }, version: 0 })
    )
    expect(detectInitialLanguage('?lang=vi')).toBe('vi')
    expect(detectInitialLanguage('?lang=en&from=cv-vn')).toBe('en')
  })

  it('priority 2: persisted localStorage value used when no ?lang= param', () => {
    localStorage.setItem(
      'language-preference',
      JSON.stringify({ state: { language: 'vi' }, version: 0 })
    )
    expect(detectInitialLanguage('')).toBe('vi')
    expect(detectInitialLanguage('?from=linkedin')).toBe('vi')
  })

  it('priority 3: ?from= referral mapping used when no ?lang= and no stored preference', () => {
    expect(detectInitialLanguage('?from=cv-vn')).toBe('vi')
    expect(detectInitialLanguage('?from=linkedin')).toBe('en')
  })

  it('priority 4: navigator.language fallback — vi-VN → vi', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'vi-VN' },
      writable: true,
      configurable: true,
    })
    expect(detectInitialLanguage('')).toBe('vi')
  })

  it('priority 4: navigator.language fallback — en-US → en', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
      configurable: true,
    })
    expect(detectInitialLanguage('')).toBe('en')
  })

  it('priority 4: unknown navigator.language → en', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'fr-FR' },
      writable: true,
      configurable: true,
    })
    expect(detectInitialLanguage('')).toBe('en')
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('language-preference', 'not-valid-json{{{')
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
      configurable: true,
    })
    // Falls through to navigator.language
    expect(detectInitialLanguage('')).toBe('en')
  })

  it('ignores invalid language value in localStorage', () => {
    localStorage.setItem(
      'language-preference',
      JSON.stringify({ state: { language: 'fr' }, version: 0 })
    )
    Object.defineProperty(global, 'navigator', {
      value: { language: 'vi-VN' },
      writable: true,
      configurable: true,
    })
    // Falls through to navigator.language since 'fr' is not valid Language
    expect(detectInitialLanguage('')).toBe('vi')
  })
})
