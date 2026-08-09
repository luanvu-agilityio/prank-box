import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import clipperBuzz from '@/assets/sounds/clipper-buzz.mp3'
import { CLIPPER_CONFIG } from '@/features/hair-clipper/constants/clipper-config'
import type { ClipperIntensity } from '@/features/hair-clipper/types/clipper-types'
import { colors } from '@/shared/constants/colors'
import { DisclaimerModal } from '@/shared/ui/DisclaimerModal'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'
import { useAppStore } from '@/stores/useAppStore'

export const ClipperScreen = () => {
  const router = useRouter()
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const [isActive, setIsActive] = useState(false)
  const [intensity, setIntensity] = useState<ClipperIntensity>(0.7)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)
  const soundOperationRef = useRef(0)
  const hapticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tremble = useSharedValue(0)
  const intensityProgress = useSharedValue(intensity)
  const trembleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tremble.value}deg` }, { translateX: tremble.value }],
  }))
  const sliderFillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: intensityProgress.value }],
  }))
  const sliderThumbStyle = useAnimatedStyle(() => ({ left: `${intensityProgress.value * 100}%` }))

  useEffect(() => {
    return () => {
      cancelAnimation(tremble)
      if (hapticTimerRef.current) clearInterval(hapticTimerRef.current)
      soundOperationRef.current += 1
      const sound = soundRef.current
      soundRef.current = null
      void sound?.unloadAsync().catch(() => undefined)
    }
  }, [tremble])

  const stopSound = async () => {
    soundOperationRef.current += 1
    const sound = soundRef.current
    soundRef.current = null
    if (!sound) return
    await sound.stopAsync().catch(() => undefined)
    await sound.unloadAsync().catch(() => undefined)
  }

  const startSound = async () => {
    if (!soundEnabled) return
    const operation = ++soundOperationRef.current
    const previousSound = soundRef.current
    soundRef.current = null
    await previousSound?.unloadAsync().catch(() => undefined)
    const { sound } = await Audio.Sound.createAsync(clipperBuzz, {
      isLooping: true,
      shouldPlay: true,
      volume: 0.8,
    })
    if (operation !== soundOperationRef.current) {
      await sound.unloadAsync().catch(() => undefined)
      return
    }
    soundRef.current = sound
  }

  const startHaptics = () => {
    if (!hapticsEnabled) return
    const impactStyle =
      intensity > 0.75
        ? Haptics.ImpactFeedbackStyle.Heavy
        : intensity > 0.45
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
    void Haptics.impactAsync(impactStyle)
    hapticTimerRef.current = setInterval(
      () => void Haptics.impactAsync(impactStyle),
      CLIPPER_CONFIG.hapticInterval,
    )
  }

  const stopHaptics = () => {
    if (hapticTimerRef.current) clearInterval(hapticTimerRef.current)
    hapticTimerRef.current = null
  }

  const startClipper = async () => {
    setIsActive(true)
    tremble.value = withRepeat(
      withSequence(withTiming(2, { duration: 55 }), withTiming(-2, { duration: 55 })),
      -1,
    )
    startHaptics()
    await startSound()
  }

  const stopClipper = async () => {
    setIsActive(false)
    cancelAnimation(tremble)
    tremble.value = withTiming(0, { duration: 120 })
    stopHaptics()
    await stopSound()
  }

  const handleToggle = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    void (isActive ? stopClipper() : startClipper())
  }

  const handleIntensityPress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent
    const nextIntensity = Math.min(
      CLIPPER_CONFIG.maxIntensity,
      Math.max(CLIPPER_CONFIG.minIntensity, locationX / 220),
    )
    setIntensity(nextIntensity)
    intensityProgress.value = nextIntensity
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    void stopClipper()
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <PrankIndicator />
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={handleBack}
          style={styles.iconButton}
        >
          <Ionicons color={colors.clipperOrange} name="chevron-back" size={24} />
        </Pressable>
        <Pressable
          accessibilityLabel="Show disclaimer"
          accessibilityRole="button"
          onPress={() => setShowDisclaimer(true)}
          style={styles.iconButton}
        >
          <Ionicons color={colors.gray} name="warning-outline" size={20} />
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={handleToggle} style={styles.touchArea}>
        <Animated.View style={[styles.clipIcon, trembleStyle]}>
          <Ionicons color={colors.clipperOrange} name="cut" size={86} />
        </Animated.View>
        <Text style={styles.hint}>{isActive ? 'TAP TO STOP' : 'TAP TO ACTIVATE'}</Text>
        {isActive && (
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityLabel}>INTENSITY</Text>
            <Pressable
              accessibilityRole="adjustable"
              onPress={handleIntensityPress}
              style={styles.sliderTrack}
            >
              <Animated.View style={[styles.sliderFill, sliderFillStyle]} />
              <Animated.View style={[styles.sliderThumb, sliderThumbStyle]} />
            </Pressable>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>LOW</Text>
              <Text style={styles.sliderLabel}>MAX</Text>
            </View>
          </View>
        )}
      </Pressable>
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
      <DisclaimerModal onClose={() => setShowDisclaimer(false)} visible={showDisclaimer} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  clipIcon: {
    alignItems: 'center',
    backgroundColor: colors.clipperOrange + '12',
    borderColor: colors.clipperOrange + '44',
    borderRadius: 60,
    borderWidth: 2,
    height: 140,
    justifyContent: 'center',
    width: 140,
  },
  container: { backgroundColor: colors.ink, flex: 1 },
  disclaimer: {
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 12,
    opacity: 0.4,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hint: {
    color: colors.clipperOrange,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 36,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  intensityContainer: { marginTop: 42, width: 220 },
  intensityLabel: {
    color: colors.offWhite,
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 14,
    textAlign: 'center',
  },
  sliderFill: {
    backgroundColor: colors.clipperOrange,
    height: 6,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  sliderLabel: { color: colors.gray, fontFamily: 'SpaceMono_400Regular', fontSize: 10 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  sliderThumb: {
    backgroundColor: colors.white,
    borderRadius: 8,
    height: 16,
    marginLeft: -8,
    position: 'absolute',
    top: -5,
    width: 16,
  },
  sliderTrack: { backgroundColor: colors.border, height: 6, position: 'relative', width: 220 },
  touchArea: { alignItems: 'center', flex: 1, justifyContent: 'center' },
})
