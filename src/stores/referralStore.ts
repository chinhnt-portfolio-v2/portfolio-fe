import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

interface ReferralStore {
  referralSource: string | null
  setReferralSource: (source: string) => void
  initializeFromUrl: () => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

/**
 * Reads the `?from=` URL parameter safely.
 * Returns null if no parameter exists or on error.
 */
function getReferralFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('from')
  } catch {
    // Fallback for SSR or non-browser environments
    return null
  }
}

/**
 * Custom storage handler to handle localStorage failures gracefully.
 * Used when localStorage is unavailable (private browsing mode).
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

type ReferralPersist = (
  config: (set: (partial: Partial<ReferralStore> | ((state: ReferralStore) => Partial<ReferralStore>)) => void) => ReferralStore,
  options: PersistOptions<ReferralStore>
) => ReturnType<typeof create<ReferralStore>>

export const useReferralStore = create<ReferralStore>()(
  (persist as ReferralPersist)(
    (set, get) => ({
      referralSource: null,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      setReferralSource: (source: string) => set({ referralSource: source }),

      initializeFromUrl: () => {
        const { _hasHydrated, referralSource } = get()
        if (!_hasHydrated) return // Wait for hydration

        // Only set from URL if no persisted value exists
        if (!referralSource) {
          const urlSource = getReferralFromUrl()
          if (urlSource) {
            set({ referralSource: urlSource })
          }
        }
      },
    }),
    {
      name: 'referral-source',
      storage: createSafeStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        // Initialize from URL after hydration completes
        state?.initializeFromUrl()
      },
    }
  )
)
