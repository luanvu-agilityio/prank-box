import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import { FlatList, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PrankCard } from '@/features/prank-catalog/components/prank-card'
import type { PrankConfig } from '@/features/prank-catalog/data/pranks'
import { pranks } from '@/features/prank-catalog/data/pranks'
import { DisclaimerModal } from '@/shared/ui/disclaimer-modal'
import { colors } from '@/shared/constants/colors'
import { usePrankStore } from '@/stores/usePrankStore'

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isPremium = usePrankStore((state) => state.isPremium)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const showLockedMessage = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    setShowDisclaimer(true)
  }

  const handleSettingsPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push('/settings')
  }

  const handleDisclaimerClose = () => setShowDisclaimer(false)
  const listContentStyle = { gap: 16, paddingBottom: insets.bottom + 32 }

  const renderPrankCard = ({ item }: ListRenderItemInfo<PrankConfig>) => (
    <View className="flex-1 px-1">
      <PrankCard
        isLocked={!isPremium && !item.isFree}
        onLockedPress={showLockedMessage}
        prank={item}
      />
    </View>
  )

  return (
    <View className="flex-1 bg-ink px-4" style={{ paddingTop: insets.top + 8 }}>
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
        contentContainerStyle={listContentStyle}
        data={pranks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderPrankCard}
        showsVerticalScrollIndicator={false}
      />
      <DisclaimerModal onClose={handleDisclaimerClose} visible={showDisclaimer} />
    </View>
  )
}
