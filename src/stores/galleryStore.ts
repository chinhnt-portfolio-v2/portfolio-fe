import { create } from 'zustand'

// Not persisted — activeFilter lives in URL search params
interface GalleryStore {
  activeFilter: string | null
  setActiveFilter: (filter: string | null) => void
}

export const useGalleryStore = create<GalleryStore>()((set) => ({
  activeFilter: null,
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))
