import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SettingRow } from '@/features/settings/components/setting-row'
import { colors } from '@/shared/constants/colors'
import { useAppStore } from '@/stores/useAppStore'
import { usePrankStore } from '@/stores/usePrankStore'
import { useIAP } from '@/features/monetization/hooks/use-iap'

export default function SettingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isPremium = usePrankStore((state) => state.isPremium)
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const setHapticsEnabled = useAppStore((state) => state.setHapticsEnabled)
  const setSoundEnabled = useAppStore((state) => state.setSoundEnabled)
  const { error: iapError, isLoading: isIAPLoading, purchase, restore } = useIAP()

  const handleBackPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  const handleHapticsChange = (value: boolean) => {
    setHapticsEnabled(value)
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handleUnlock = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    void purchase()
  }

  const handleRestore = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    void restore()
  }

  return (
    <ScrollView
      className="flex-1 bg-ink px-4"
      contentContainerClassName="flex-grow"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingTop: insets.top + 8 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-8 flex-row items-center justify-between">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
          onPress={handleBackPress}
          className="h-11 w-11 items-center justify-center rounded-xl bg-surface"
        >
          <Ionicons color={colors.white} name="chevron-back" size={24} />
        </Pressable>
        <Text className="font-inter-bold text-2xl text-white">Settings</Text>
        <View className="w-11" />
      </View>
      <Text className="mb-2 mt-4 font-mono text-micro tracking-widest text-gray">PREMIUM</Text>
      <View className="flex-row items-center rounded-2xl border border-gold/30 bg-surface p-4">
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-gold/15">
          <Ionicons color={colors.gold} name="sparkles" size={24} />
        </View>
        <View className="flex-1">
          <Text className="font-inter-bold text-base text-white">
            {isPremium ? 'Premium ✓' : 'Free user'}
          </Text>
          <Text className="mt-1 font-inter text-caption text-gray">
            {isPremium ? 'All pranks unlocked. No ads.' : 'Unlock the full prank arsenal.'}
          </Text>
        </View>
        {!isPremium && (
          <Pressable
            accessibilityRole="button"
            disabled={isIAPLoading}
            onPress={handleUnlock}
            className="rounded-lg bg-gold px-4 py-2"
          >
            <Text className="font-inter-bold text-caption text-ink">
              {isIAPLoading ? '...' : '$1.99'}
            </Text>
          </Pressable>
        )}
      </View>
      {!isPremium && (
        <View className="mt-2 flex-row items-center justify-between px-2">
          <Text className="flex-1 font-inter text-caption text-error">{iapError ?? ''}</Text>
          <Pressable accessibilityRole="button" onPress={handleRestore}>
            <Text className="font-inter text-caption text-gray underline">Restore purchase</Text>
          </Pressable>
        </View>
      )}
      <Text className="mb-2 mt-6 font-mono text-micro tracking-widest text-gray">PREFERENCES</Text>
      <View className="rounded-2xl bg-surface px-4">
        <SettingRow
          icon="radio-button-on"
          label="Haptics"
          onValueChange={handleHapticsChange}
          value={hapticsEnabled}
        />
        <View className="h-px bg-border" />
        <SettingRow
          icon="volume-high"
          label="Sound"
          onValueChange={setSoundEnabled}
          value={soundEnabled}
        />
      </View>
      <Text className="mb-2 mt-6 font-mono text-micro tracking-widest text-gray">
        ABOUT / LEGAL
      </Text>
      <View className="rounded-2xl bg-surface px-4">
        <View className="min-h-header flex-row items-center justify-between">
          <Text className="font-inter-bold text-base text-white">PrankBox</Text>
          <Text className="font-mono text-caption text-gray">Version 1.0.0</Text>
        </View>
        <View className="h-px bg-border" />
        <Text className="py-4 font-inter text-caption leading-5 text-gray">
          For entertainment purposes only. This app contains simulated pranks. No real shocks,
          ghosts, calls, or system changes occur. Please prank responsibly.
        </Text>
        <View className="h-px bg-border" />
        <Text className="py-4 font-inter text-caption leading-5 text-gray">
          PrankBox does not collect prank inputs or personal content. Free users may see ads
          provided by Google AdMob, which may process device and usage data for advertising.
        </Text>
      </View>
    </ScrollView>
  )
}
