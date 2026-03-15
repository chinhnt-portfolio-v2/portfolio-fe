import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

import { useReferralStore } from './referralStore'

type Language = 'vi' | 'en'

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
  autoSetFromReferral: () => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

/**
 * Maps referral sources to their preferred languages.
 */
const REFERRAL_LANGUAGE_MAP: Record<string, Language> = {
  linkedin: 'en',
  'cv-vn': 'vi',
}

/**
 * Custom storage handler to handle localStorage failures gracefully.
 */
function createSafeStorage() {
  return {
    getItem: (name: string): string | null => {
      try {
        return localStorage.getItem(name)
      } catch {
        return null
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        localStorage.setItem(name, value)
      } catch {
        // Silently fail in private browsing mode
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name)
      } catch {
        // Silently fail in private browsing mode
      }
    },
  }
}

type LanguagePersist = (
  config: (set: (partial: Partial<LanguageStore> | ((state: LanguageStore) => Partial<LanguageStore>)) => void) => LanguageStore,
  options: PersistOptions<LanguageStore>
) => ReturnType<typeof create<LanguageStore>>

export const useLanguageStore = create<LanguageStore>()(
  (persist as LanguagePersist)(
    (set, get) => ({
      language: 'en',
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      setLanguage: (language: Language) => set({ language }),

      /**
       * Auto-sets language based on referral source.
       * Only applies if user hasn't manually set a language preference.
       * Should be called after both stores have hydrated.
       */
      autoSetFromReferral: () => {
        const { _hasHydrated, language } = get()
        if (!_hasHydrated) return

        const referralSource = useReferralStore.getState().referralSource

        if (referralSource && REFERRAL_LANGUAGE_MAP[referralSource]) {
          const preferredLanguage = REFERRAL_LANGUAGE_MAP[referralSource]
          // Only auto-set if current language is still the default ('en')
          // This preserves manual user preference
          if (language === 'en') {
            set({ language: preferredLanguage })
          }
        }
      },
    }),
    {
      name: 'language-preference',
      storage: createSafeStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        // Auto-set language from referral after hydration
        state?.autoSetFromReferral()
      },
    }
  )
)
