import { create } from 'zustand'
import { MONETIZATION_CONFIG } from '@/features/monetization/constants/monetization-config'
import type { AdStoreState } from '@/features/monetization/types/monetization-types'

interface AdStore extends AdStoreState {
  adsReady: boolean
  incrementPrankOpen: () => void
  markInterstitialShown: () => void
  privacyOptionsRequired: boolean
  resetSession: () => void
  setAdsReady: (value: boolean) => void
  setPrivacyOptionsRequired: (value: boolean) => void
  shouldShowInterstitial: (isPremium: boolean) => boolean
}

export const useAdStore = create<AdStore>((set, get) => ({
  adsReady: false,
  incrementPrankOpen: () => set((state) => ({ prankOpenCount: state.prankOpenCount + 1 })),
  lastInterstitialTime: 0,
  markInterstitialShown: () => set({ lastInterstitialTime: Date.now() }),
  privacyOptionsRequired: false,
  prankOpenCount: 0,
  resetSession: () => set({ lastInterstitialTime: 0, prankOpenCount: 0 }),
  setAdsReady: (adsReady) => set({ adsReady }),
  setPrivacyOptionsRequired: (privacyOptionsRequired) => set({ privacyOptionsRequired }),
  shouldShowInterstitial: (isPremium) => {
    const { lastInterstitialTime, prankOpenCount } = get()
    return (
      !isPremium &&
      prankOpenCount >= MONETIZATION_CONFIG.interstitialOpenThreshold &&
      Date.now() - lastInterstitialTime >= MONETIZATION_CONFIG.interstitialCooldown
    )
  },
}))
