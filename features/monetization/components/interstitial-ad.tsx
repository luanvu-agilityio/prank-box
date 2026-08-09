import { AdEventType, InterstitialAd as GoogleInterstitialAd } from 'react-native-google-mobile-ads'
import { useEffect } from 'react'
import { AD_CONFIG } from '@/features/monetization/constants/ad-config'

interface InterstitialAdProps {
  onDismiss: () => void
  visible: boolean
}

export function InterstitialAd({ onDismiss, visible }: InterstitialAdProps) {
  useEffect(() => {
    if (!visible) return
    const ad = GoogleInterstitialAd.createForAdRequest(AD_CONFIG.interstitialUnitId)
    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      void ad.show()
    })
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, onDismiss)
    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, onDismiss)
    ad.load()
    return () => {
      unsubscribeLoaded()
      unsubscribeClosed()
      unsubscribeError()
    }
  }, [onDismiss, visible])

  return null
}
