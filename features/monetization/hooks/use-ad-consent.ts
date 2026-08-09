import { AdsConsent, MobileAds } from 'react-native-google-mobile-ads'
import { useCallback, useEffect } from 'react'
import { useAdStore } from '@/stores/useAdStore'

let consentInitialization: Promise<void> | null = null

export function useAdConsent() {
  const setAdsReady = useAdStore((state) => state.setAdsReady)
  const setPrivacyOptionsRequired = useAdStore((state) => state.setPrivacyOptionsRequired)

  const applyConsent = useCallback(
    async (canRequestAds: boolean, privacyOptionsRequired: boolean) => {
      setPrivacyOptionsRequired(privacyOptionsRequired)
      if (!canRequestAds) {
        setAdsReady(false)
        return
      }
      await MobileAds().initialize()
      setAdsReady(true)
    },
    [setAdsReady, setPrivacyOptionsRequired],
  )

  const showPrivacyOptions = useCallback(async () => {
    const consentInfo = await AdsConsent.showPrivacyOptionsForm()
    await applyConsent(
      consentInfo.canRequestAds,
      consentInfo.privacyOptionsRequirementStatus === 'REQUIRED',
    )
  }, [applyConsent])

  useEffect(() => {
    const initializeConsent = async () => {
      try {
        const consentInfo = await AdsConsent.gatherConsent()
        await applyConsent(
          consentInfo.canRequestAds,
          consentInfo.privacyOptionsRequirementStatus === 'REQUIRED',
        )
      } catch {
        setAdsReady(false)
      }
    }
    if (!consentInitialization) consentInitialization = initializeConsent()
  }, [applyConsent, setAdsReady])

  return { showPrivacyOptions }
}
