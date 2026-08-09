export const IAPResponseCode = {
  OK: 0,
  ERROR: 1,
  DEFERRED: 2,
} as const

export interface IAPItemDetails {
  productId: string
  price: string
  title: string
  description: string
}

export interface InAppPurchase {
  productId: string
  acknowledged: boolean
}

export const connectAsync = async () => undefined
export const disconnectAsync = async () => undefined
export const finishTransactionAsync = async () => undefined
export const getProductsAsync = async (_productIds: string[]) => ({ results: [] })
export const getPurchaseHistoryAsync = async () => ({ results: [] })
export const purchaseItemAsync = async (_productId: string) => undefined
export const setPurchaseListener = () => undefined
