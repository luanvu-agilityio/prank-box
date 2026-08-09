import { TestIds } from 'react-native-google-mobile-ads'

export const AD_CONFIG = {
  bannerUnitId: __DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR-ID/YOUR-BANNER-ID',
} as const
