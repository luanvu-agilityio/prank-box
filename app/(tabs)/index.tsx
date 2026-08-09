import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PrankCard } from '@/features/prank-catalog/components/PrankCard'
import type { PrankConfig } from '@/features/prank-catalog/data/pranks'
import { pranks } from '@/features/prank-catalog/data/pranks'
import { colors } from '@/shared/constants/colors'
import { usePrankStore } from '@/stores/usePrankStore'
import { useAdStore } from '@/stores/useAdStore'
import { BannerAd } from '@/features/monetization/components/BannerAd'
import { InterstitialAd } from '@/features/monetization/components/InterstitialAd'
import { IAPModal } from '@/features/monetization/components/IAPModal'
import { useIAP } from '@/features/monetization/hooks/useIap'

const HomeScreen = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isPremium = usePrankStore((state) => state.isPremium)
  const [showIAP, setShowIAP] = useState(false)
  const [showInterstitial, setShowInterstitial] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
  const incrementPrankOpen = useAdStore((state) => state.incrementPrankOpen)
  const markInterstitialShown = useAdStore((state) => state.markInterstitialShown)
  const { error: iapError, isLoading: isIAPLoading, purchase, restore } = useIAP()

  const showLockedMessage = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    setShowIAP(true)
  }

  useEffect(() => {
    if (!isPremium) return
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }, [isPremium])

  const handleSettingsPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push('/settings')
  }

  const handlePrankOpen = useCallback(
    (navigate: () => void) => {
      incrementPrankOpen()
      if (useAdStore.getState().shouldShowInterstitial(isPremium)) {
        setPendingNavigation(() => navigate)
        setShowInterstitial(true)
        return
      }
      navigate()
    },
    [incrementPrankOpen, isPremium],
  )

  const handleInterstitialDismiss = useCallback(() => {
    markInterstitialShown()
    setShowInterstitial(false)
    pendingNavigation?.()
    setPendingNavigation(null)
  }, [markInterstitialShown, pendingNavigation])

  const handleIAPClose = () => setShowIAP(false)
  const screenStyle = StyleSheet.create({ screen: { paddingTop: insets.top + 8 } })
  const listContentStyle = StyleSheet.create({
    content: { gap: 16, paddingBottom: insets.bottom + 32 },
  })

  const renderPrankCard = ({ item }: ListRenderItemInfo<PrankConfig>) => (
    <View className="flex-1 px-1">
      <PrankCard
        isLocked={!isPremium && !item.isFree}
        onOpen={handlePrankOpen}
        onLockedPress={showLockedMessage}
        prank={item}
      />
    </View>
  )

  return (
    <View className="flex-1 bg-ink px-4" style={screenStyle.screen}>
      <View className="mb-1 flex-row items-center justify-between">
        <View>
          <Text className="mb-1 font-mono text-micro tracking-widest text-gray">
            YOUR PRANK ARSENAL
          </Text>
          <Text className="font-inter-bold text-h1 tracking-tighter text-white">
            Prank<Text className="text-gold">Box</Text>
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Open settings"
          accessibilityRole="button"
          hitSlop={12}
          onPress={handleSettingsPress}
          className="h-header w-header items-center justify-center rounded-control border border-border bg-surface"
        >
          <Ionicons color={colors.offWhite} name="settings-outline" size={22} />
        </Pressable>
      </View>
      <Text className="mb-6 font-inter text-base text-off-white">Pick a prank. Make a memory.</Text>
      <FlatList
        contentContainerStyle={listContentStyle.content}
        data={pranks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderPrankCard}
        showsVerticalScrollIndicator={false}
      />
      <BannerAd />
      <InterstitialAd onDismiss={handleInterstitialDismiss} visible={showInterstitial} />
      <IAPModal
        error={iapError}
        isLoading={isIAPLoading}
        onClose={handleIAPClose}
        onPurchase={purchase}
        onRestore={restore}
        visible={showIAP && !isPremium}
      />
    </View>
  )
}

export default HomeScreen
