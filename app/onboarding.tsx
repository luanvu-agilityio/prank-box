import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { onboardingSteps } from '@/features/onboarding/constants/onboarding-steps'
import { ActionButton } from '@/shared/ui/action-button'
import { useAppStore } from '@/stores/useAppStore'

export default function OnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding)
  const [stepIndex, setStepIndex] = useState(0)
  const [understandsDisclaimer, setUnderstandsDisclaimer] = useState(false)
  const step = onboardingSteps[stepIndex]
  const isDisclaimer = stepIndex === 1
  const isLastStep = stepIndex === onboardingSteps.length - 1

  const handleNext = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (isDisclaimer && !understandsDisclaimer) return
    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }
    setHasSeenOnboarding(true)
    router.replace('/(tabs)')
  }

  const handleSkip = () => {
    if (isDisclaimer) return
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setHasSeenOnboarding(true)
    router.replace('/(tabs)')
  }

  const handleDisclaimerToggle = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setUnderstandsDisclaimer((current) => !current)
  }

  const renderProgressDot = (item: (typeof onboardingSteps)[number], index: number) => (
    <View
      className={
        index === stepIndex
          ? 'h-2 flex-1 rounded-full bg-gold'
          : 'h-2 flex-1 rounded-full bg-white/10'
      }
      key={item.eyebrow}
    />
  )

  const screenStyle = StyleSheet.create({
    screen: { paddingBottom: insets.bottom + 24, paddingTop: insets.top + 24 },
  })

  return (
    <View className="flex-1 bg-ink px-6" style={screenStyle.screen}>
      <View className="flex-row items-center justify-between">
        <Text className="font-mono text-micro tracking-widest text-gold">PRANKBOX</Text>
        {!isDisclaimer && (
          <Pressable accessibilityRole="button" onPress={handleSkip}>
            <Text className="font-inter-medium text-caption text-gray">Skip</Text>
          </Pressable>
        )}
      </View>
      <View className="flex-1 justify-center">
        <View className="mb-8 h-24 w-24 items-center justify-center rounded-3xl bg-white/5">
          <Text className="text-5xl">{step.icon}</Text>
        </View>
        <Text className="mb-3 font-mono text-micro tracking-widest text-gray">{step.eyebrow}</Text>
        <Text className="mb-5 font-inter-bold text-h1 leading-10 text-white">{step.title}</Text>
        <Text className="font-inter text-body leading-6 text-off-white">{step.body}</Text>
        {isDisclaimer && (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: understandsDisclaimer }}
            className="mt-8 flex-row items-center"
            onPress={handleDisclaimerToggle}
          >
            <View
              className={
                understandsDisclaimer
                  ? 'mr-3 h-6 w-6 items-center justify-center rounded-md bg-success'
                  : 'mr-3 h-6 w-6 rounded-md border-2 border-gray'
              }
            >
              {understandsDisclaimer && <Text className="font-inter-bold text-white">✓</Text>}
            </View>
            <Text className="flex-1 font-inter-medium text-caption text-off-white">
              I understand — this is for entertainment
            </Text>
          </Pressable>
        )}
      </View>
      <View className="mb-8 flex-row gap-2">{onboardingSteps.map(renderProgressDot)}</View>
      <ActionButton
        label={isLastStep ? "Let's Go" : isDisclaimer ? 'Enter PrankBox' : 'Get Started'}
        onPress={handleNext}
        tone={isDisclaimer && !understandsDisclaimer ? 'ghost' : 'light'}
      />
    </View>
  )
}
