import { create } from 'zustand'
import { MONETIZATION_CONFIG } from '@/features/monetization/constants/monetization-config'
import type { AdStoreState } from '@/features/monetization/types/monetization-types'

interface AdStore extends AdStoreState {
  incrementPrankOpen: () => void
  markInterstitialShown: () => void
  resetSession: () => void
  shouldShowInterstitial: (isPremium: boolean) => boolean
}

export const useAdStore = create<AdStore>((set, get) => ({
  incrementPrankOpen: () => set((state) => ({ prankOpenCount: state.prankOpenCount + 1 })),
  lastInterstitialTime: 0,
  markInterstitialShown: () => set({ lastInterstitialTime: Date.now() }),
  prankOpenCount: 0,
  resetSession: () => set({ lastInterstitialTime: 0, prankOpenCount: 0 }),
  shouldShowInterstitial: (isPremium) => {
    const { lastInterstitialTime, prankOpenCount } = get()
    return (
      !isPremium &&
      prankOpenCount >= MONETIZATION_CONFIG.interstitialOpenThreshold &&
      Date.now() - lastInterstitialTime >= MONETIZATION_CONFIG.interstitialCooldown
    )
  },
}))
