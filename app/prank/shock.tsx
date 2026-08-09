import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useAppStore } from '@/stores/useAppStore'
import { colors } from '@/shared/constants/colors'
import { PrankIndicator } from '@/shared/ui/prank-indicator'
import electricBuzz from '@/assets/sounds/electric-buzz.mp3'

export default function ShockScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const [isActive, setIsActive] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)
  const soundOperationRef = useRef(0)
  const hapticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pulse = useSharedValue(1)
  const flash = useSharedValue(0)
  const boltScale = useSharedValue(1)
  const arcProgress = useSharedValue(0)
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }))
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }))
  const boltStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boltScale.value }, { rotate: `${boltScale.value * 4 - 4}deg` }],
  }))
  const arcStyle = useAnimatedStyle(() => ({
    opacity: arcProgress.value,
    transform: [{ scaleX: arcProgress.value }],
  }))

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 750 }), withTiming(1, { duration: 750 })),
      -1,
    )
    return () => {
      cancelAnimation(pulse)
      cancelAnimation(flash)
      cancelAnimation(boltScale)
      cancelAnimation(arcProgress)
      if (hapticTimerRef.current) clearInterval(hapticTimerRef.current)
      soundOperationRef.current += 1
      const sound = soundRef.current
      soundRef.current = null
      void sound?.unloadAsync().catch(() => undefined)
    }
  }, [arcProgress, boltScale, flash, pulse])

  const startHaptics = () => {
    if (!hapticsEnabled) return
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    hapticTimerRef.current = setInterval(() => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }, 200)
  }

  const stopHaptics = () => {
    if (hapticTimerRef.current) clearInterval(hapticTimerRef.current)
    hapticTimerRef.current = null
  }

  const startSound = async () => {
    if (!soundEnabled) return
    const operation = ++soundOperationRef.current
    const previousSound = soundRef.current
    soundRef.current = null
    await previousSound?.unloadAsync().catch(() => undefined)
    const { sound } = await Audio.Sound.createAsync(electricBuzz, {
      isLooping: true,
      volume: 0.8,
      shouldPlay: true,
    })
    if (operation !== soundOperationRef.current) {
      await sound.unloadAsync().catch(() => undefined)
      return
    }
    soundRef.current = sound
  }

  const stopSound = async () => {
    soundOperationRef.current += 1
    const sound = soundRef.current
    soundRef.current = null
    if (!sound) return
    await sound.stopAsync().catch(() => undefined)
    await sound.unloadAsync().catch(() => undefined)
  }

  const startShock = async () => {
    setIsActive(true)
    startHaptics()
    flash.value = withRepeat(
      withSequence(withTiming(0.72, { duration: 50 }), withTiming(0, { duration: 50 })),
      -1,
    )
    boltScale.value = withRepeat(
      withSequence(withTiming(1.45, { duration: 160 }), withTiming(1.05, { duration: 160 })),
      -1,
    )
    arcProgress.value = withRepeat(
      withSequence(withTiming(1, { duration: 220 }), withTiming(0.25, { duration: 220 })),
      -1,
    )
    await startSound()
  }

  const stopShock = async () => {
    setIsActive(false)
    stopHaptics()
    cancelAnimation(flash)
    cancelAnimation(boltScale)
    cancelAnimation(arcProgress)
    flash.value = withTiming(0, { duration: 120 })
    boltScale.value = withTiming(1, { duration: 180 })
    arcProgress.value = withTiming(0, { duration: 120 })
    await stopSound()
  }

  const handleToggle = () => {
    void (isActive ? stopShock() : startShock())
  }
  const handleBackPress = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (isActive) await stopShock()
    router.back()
  }

  const screenStyle = StyleSheet.create({
    header: { top: insets.top + 8 },
    screen: { paddingBottom: insets.bottom, paddingTop: insets.top },
  })

  return (
    <View className="flex-1 bg-ink" style={screenStyle.screen}>
      <PrankIndicator />
      <Animated.View
        className="absolute inset-0 bg-electric-yellow"
        pointerEvents="none"
        style={flashStyle}
      />
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        className="absolute left-5 top-4 z-10 h-11 w-11 items-center justify-center rounded-xl bg-white/10"
        onPress={handleBackPress}
        style={screenStyle.header}
      >
        <Ionicons color={colors.electricYellow} name="chevron-back" size={24} />
      </Pressable>
      <View
        className="absolute right-5 z-10 h-11 w-11 items-center justify-center rounded-xl bg-white/10"
        style={screenStyle.header}
      >
        <Ionicons color={colors.gray} name="warning-outline" size={20} />
      </View>
      <Pressable
        accessibilityLabel={
          isActive ? 'Stop electric shock prank' : 'Activate electric shock prank'
        }
        accessibilityRole="button"
        className="flex-1 items-center justify-center"
        onPress={handleToggle}
      >
        <Animated.View style={[pulseStyle, boltStyle]}>
          <View className="h-48 w-48 items-center justify-center rounded-full border-2 border-electric-yellow/20 bg-electric-yellow/5">
            <Ionicons color={colors.electricYellow} name="flash" size={116} />
          </View>
        </Animated.View>
        <View className="absolute h-1 w-arc bg-electric-yellow" style={arcStyle} />
        <Text className="mt-12 font-mono text-micro tracking-electric text-electric-yellow">
          {isActive ? 'TAP TO STOP' : 'TAP TO ACTIVATE'}
        </Text>
      </Pressable>
      <Text className="pb-4 text-center font-inter text-micro text-white/40">
        For entertainment purposes only
      </Text>
    </View>
  )
}
