import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AppStore {
  hapticsEnabled: boolean
  soundEnabled: boolean
  hasSeenOnboarding: boolean
  setHapticsEnabled: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  setHasSeenOnboarding: (seen: boolean) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      soundEnabled: true,
      hasSeenOnboarding: false,
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
    }),
    { name: 'prankbox-app', storage: createJSONStorage(() => AsyncStorage) },
  ),
)
