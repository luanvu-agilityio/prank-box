import { BannerAd as GoogleBannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { StyleSheet, View } from 'react-native'
import { AD_CONFIG } from '@/features/monetization/constants/ad-config'
import { usePrankStore } from '@/stores/usePrankStore'
import { useAdStore } from '@/stores/useAdStore'

export function BannerAd() {
  const isPremium = usePrankStore((state) => state.isPremium)
  const adsReady = useAdStore((state) => state.adsReady)

  if (isPremium || !adsReady) return null

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        unitId={AD_CONFIG.bannerUnitId}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: 'transparent', minHeight: 50 },
})
