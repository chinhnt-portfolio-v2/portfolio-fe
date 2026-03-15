import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

type TabType = 'featured' | 'technical'

interface ReturnVisitorState {
  lastViewedSlug: string | null
  lastViewedTab: TabType | null
  lastVisitTimestamp: number | null
  bannerDismissed: boolean
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  setLastViewedSlug: (slug: string | null) => void
  setLastViewedTab: (tab: TabType) => void
  dismissBanner: () => void
  updateTimestamp: () => void
  isReturningVisitor: () => boolean
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

type ReturnVisitorPersist = (
  config: (set: (partial: Partial<ReturnVisitorState> | ((state: ReturnVisitorState) => Partial<ReturnVisitorState>)) => void) => ReturnVisitorState,
  options: PersistOptions<ReturnVisitorState>
) => ReturnType<typeof create<ReturnVisitorState>>

export const useReturnVisitorStore = create<ReturnVisitorState>()(
  (persist as ReturnVisitorPersist)(
    (set, get) => ({
      lastViewedSlug: null,
      lastViewedTab: null,
      lastVisitTimestamp: null,
      bannerDismissed: false,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      setLastViewedSlug: (slug: string | null) => set({ lastViewedSlug: slug }),

      setLastViewedTab: (tab: TabType) => set({ lastViewedTab: tab }),

      dismissBanner: () => set({ bannerDismissed: true }),

      updateTimestamp: () => set({ lastVisitTimestamp: Date.now() }),

      isReturningVisitor: () => {
        const state = get()
        // A returning visitor is someone who has a lastViewedSlug set
        // (meaning they have visited before and viewed a project)
        return state.lastViewedSlug !== null && state.lastViewedSlug !== ''
      },
    }),
    {
      name: 'pf_return_visitor',
      storage: createSafeStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
