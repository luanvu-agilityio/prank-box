import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface PrankStore {
  isPremium: boolean
  setPremium: (isPremium: boolean) => void
}

export const usePrankStore = create<PrankStore>()(
  persist((set) => ({ isPremium: false, setPremium: (isPremium) => set({ isPremium }) }), {
    name: 'prankbox-premium',
    storage: createJSONStorage(() => AsyncStorage),
  }),
)
