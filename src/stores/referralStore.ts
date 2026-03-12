import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReferralStore {
  referralSource: string | null
  setReferralSource: (source: string) => void
}

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set) => ({
      referralSource: null,
      setReferralSource: (source) => set({ referralSource: source }),
    }),
    { name: 'referral-source' }
  )
)
