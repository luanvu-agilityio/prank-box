import { TestIds } from 'react-native-google-mobile-ads'

export const AD_CONFIG = {
  bannerUnitId: __DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR-ID/YOUR-BANNER-ID',
  interstitialUnitId: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-YOUR-ID/YOUR-INTERSTITIAL-ID',
} as const
