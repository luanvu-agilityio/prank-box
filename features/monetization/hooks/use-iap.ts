import { useEffect } from 'react'
import { useIAPStore } from '@/stores/useIAPStore'

export function useIAP() {
  const initialize = useIAPStore((state) => state.initialize)
  const purchase = useIAPStore((state) => state.purchase)
  const restore = useIAPStore((state) => state.restore)
  const isLoading = useIAPStore((state) => state.isLoading)
  const error = useIAPStore((state) => state.error)

  useEffect(() => {
    void initialize()
  }, [initialize])

  return { error, isLoading, purchase, restore }
}
