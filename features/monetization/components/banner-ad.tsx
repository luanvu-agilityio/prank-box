import { BannerAd as GoogleBannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { StyleSheet, View } from 'react-native'
import { AD_CONFIG } from '@/features/monetization/constants/ad-config'
import { usePrankStore } from '@/stores/usePrankStore'

export function BannerAd() {
  const isPremium = usePrankStore((state) => state.isPremium)

  if (isPremium) return null

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
