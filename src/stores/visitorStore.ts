import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VisitorStore {
  returnCount: number
  lastViewedProjectSlug: string | null
  incrementReturnCount: () => void
  setLastViewedProjectSlug: (slug: string) => void
}

export const useVisitorStore = create<VisitorStore>()(
  persist(
    (set) => ({
      returnCount: 0,
      lastViewedProjectSlug: null,
      incrementReturnCount: () => set((state) => ({ returnCount: state.returnCount + 1 })),
      setLastViewedProjectSlug: (slug) => set({ lastViewedProjectSlug: slug }),
    }),
    { name: 'visitor-data' }
  )
)
