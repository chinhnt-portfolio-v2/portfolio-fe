type Language = 'en' | 'vi'

// Parse `?from=` query param to determine referral source
export function parseReferralSource(search: string): string | null {
  const params = new URLSearchParams(search)
  return params.get('from')
}

/**
 * Maps a ?from= referral source to a default language.
 * Returns null if the source doesn't have a language mapping.
 */
export function getLanguageFromReferral(source: string | null): Language | null {
  if (source === 'linkedin') return 'en'
  if (source === 'cv-vn') return 'vi'
  return null
}

/**
 * Parses ?lang= URL param to a Language.
 * Returns null if not present or invalid value.
 */
export function getLangFromUrlParam(search: string): Language | null {
  const params = new URLSearchParams(search)
  const lang = params.get('lang')
  if (lang === 'vi' || lang === 'en') return lang
  return null
}

/**
 * Determines the initial language using priority order:
 * 1. ?lang= URL param (explicit override — always wins)
 * 2. Persisted Zustand value in localStorage
 * 3. ?from= referral source → language mapping
 * 4. navigator.language fallback (vi-* → 'vi', else 'en')
 */
export function detectInitialLanguage(search: string): Language {
  // Priority 1: ?lang= explicit override
  const urlLang = getLangFromUrlParam(search)
  if (urlLang) return urlLang

  // Priority 2: Persisted Zustand value
  try {
    const raw = localStorage.getItem('language-preference')
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { language?: unknown } }
      const stored = parsed?.state?.language
      if (stored === 'en' || stored === 'vi') return stored
    }
  } catch {
    // localStorage unavailable (SSR / private mode) — continue to fallback
  }

  // Priority 3: ?from= referral mapping
  const from = parseReferralSource(search)
  const referralLang = getLanguageFromReferral(from)
  if (referralLang) return referralLang

  // Priority 4: navigator.language fallback
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('vi')) return 'vi'
  return 'en'
}
