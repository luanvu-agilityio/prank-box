import {
  IAPResponseCode,
  connectAsync,
  disconnectAsync,
  finishTransactionAsync,
  getProductsAsync,
  getPurchaseHistoryAsync,
  purchaseItemAsync,
  setPurchaseListener,
  type IAPItemDetails,
  type InAppPurchase,
} from 'expo-in-app-purchases'
import { create } from 'zustand'
import { MONETIZATION_CONFIG } from '@/features/monetization/constants/monetization-config'
import { usePrankStore } from '@/stores/usePrankStore'

interface IAPStore {
  dispose: () => void
  error: string | null
  initialize: () => Promise<void>
  isInitialized: boolean
  isLoading: boolean
  product: IAPItemDetails | null
  purchase: () => Promise<void>
  restore: () => Promise<void>
}

const handlePurchase = async ({
  responseCode,
  results,
}: {
  responseCode?: IAPResponseCode
  results?: InAppPurchase[]
}) => {
  if (responseCode !== IAPResponseCode.OK || !results) return
  const matchingPurchase = results.find(
    (purchaseItem) => purchaseItem.productId === MONETIZATION_CONFIG.productId,
  )
  if (!matchingPurchase) return
  usePrankStore.getState().setPremium(true)
  if (!matchingPurchase.acknowledged) await finishTransactionAsync(matchingPurchase, false)
}

export const useIAPStore = create<IAPStore>((set, get) => ({
  dispose: () => {
    if (!get().isInitialized) return
    void disconnectAsync()
    set({ isInitialized: false })
  },
  error: null,
  initialize: async () => {
    if (get().isInitialized || get().isLoading) return
    set({ error: null, isLoading: true })
    try {
      await connectAsync()
      setPurchaseListener((result) => void handlePurchase(result))
      const response = await getProductsAsync([MONETIZATION_CONFIG.productId])
      set({ isInitialized: true, product: response.results?.[0] ?? null })
    } catch {
      set({ error: 'Purchases are currently unavailable.' })
    } finally {
      set({ isLoading: false })
    }
  },
  isInitialized: false,
  isLoading: false,
  product: null,
  purchase: async () => {
    if (!get().isInitialized) await get().initialize()
    if (!get().isInitialized) return
    set({ error: null, isLoading: true })
    try {
      await purchaseItemAsync(MONETIZATION_CONFIG.productId)
    } catch {
      set({ error: 'Purchase could not be completed.' })
    } finally {
      set({ isLoading: false })
    }
  },
  restore: async () => {
    if (!get().isInitialized) await get().initialize()
    if (!get().isInitialized) return
    set({ error: null, isLoading: true })
    try {
      const response = await getPurchaseHistoryAsync()
      const hasPurchase = response.results?.some(
        (purchaseItem) => purchaseItem.productId === MONETIZATION_CONFIG.productId,
      )
      if (hasPurchase) usePrankStore.getState().setPremium(true)
    } catch {
      set({ error: 'Purchases could not be restored.' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
