import { create } from 'zustand'

interface PrankStore {
  isPremium: boolean
  setPremium: (isPremium: boolean) => void
}

export const usePrankStore = create<PrankStore>((set) => ({
  isPremium: false,
  setPremium: (isPremium) => set({ isPremium }),
}))
