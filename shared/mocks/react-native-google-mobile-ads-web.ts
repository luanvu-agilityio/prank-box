export const MobileAds = () => ({ initialize: async () => undefined })
export const AdsConsent = {
  gatherConsent: async () => ({
    canRequestAds: false,
    privacyOptionsRequirementStatus: 'NOT_REQUIRED',
  }),
  showPrivacyOptionsForm: async () => ({
    canRequestAds: false,
    privacyOptionsRequirementStatus: 'NOT_REQUIRED',
  }),
}
export const TestIds = { BANNER: '', INTERSTITIAL: '' }
export const BannerAdSize = { SMART_BANNER: 'smart_banner' }

export const BannerAd = () => null
export const InterstitialAd = () => null
