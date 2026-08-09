import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import screamSound from '@/assets/sounds/scream.mp3'
import { DECOY_PROMPTS, SCREAM_CONFIG } from '@/features/scary-scream/constants/scream-config'
import type { ScareStatus } from '@/features/scary-scream/types/scream-types'
import { colors } from '@/shared/constants/colors'
import { DisclaimerModal } from '@/shared/ui/disclaimer-modal'
import { useAppStore } from '@/stores/useAppStore'

export default function ScreamScreen() {
  const router = useRouter()
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const [status, setStatus] = useState<ScareStatus>('calm')
  const [cycle, setCycle] = useState(0)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [prompt, setPrompt] = useState(
    () => DECOY_PROMPTS[Math.floor(Math.random() * DECOY_PROMPTS.length)],
  )
  const soundRef = useRef<Audio.Sound | null>(null)
  const scareEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shake = useSharedValue(0)
  const scale = useSharedValue(1)
  const scareStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shake.value },
      { translateY: shake.value * 0.5 },
      { scale: scale.value },
    ],
  }))

  useEffect(() => {
    let cancelled = false
    const delay =
      SCREAM_CONFIG.minDelay + Math.random() * (SCREAM_CONFIG.maxDelay - SCREAM_CONFIG.minDelay)
    const scareTimer = setTimeout(() => {
      setStatus('scaring')
      scale.value = withTiming(1.08, { duration: 120 })
      shake.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
      if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      if (soundEnabled) {
        void Audio.Sound.createAsync(screamSound, { shouldPlay: true, volume: 1 }).then(
          async ({ sound }) => {
            if (cancelled) {
              await sound.unloadAsync().catch(() => undefined)
              return
            }
            soundRef.current = sound
          },
        )
      }
      scareEndTimerRef.current = setTimeout(() => setStatus('gotcha'), SCREAM_CONFIG.scareDuration)
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(scareTimer)
      if (scareEndTimerRef.current) clearTimeout(scareEndTimerRef.current)
      cancelAnimation(shake)
      cancelAnimation(scale)
      const sound = soundRef.current
      soundRef.current = null
      void sound?.unloadAsync().catch(() => undefined)
    }
  }, [cycle, hapticsEnabled, scale, shake, soundEnabled])

  const handleRestart = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus('calm')
    setPrompt(DECOY_PROMPTS[Math.floor(Math.random() * DECOY_PROMPTS.length)])
    setCycle((currentCycle) => currentCycle + 1)
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  const isScaring = status === 'scaring'
  return (
    <SafeAreaView style={styles.container}>
      {!isScaring && (
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={handleBack}
            style={styles.iconButton}
          >
            <Ionicons color={colors.bloodRed} name="chevron-back" size={24} />
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
      )}
      <Pressable
        accessibilityRole="button"
        onPress={status === 'gotcha' ? handleRestart : undefined}
        style={styles.touchArea}
      >
        <Animated.View style={scareStyle}>
          {isScaring ? (
            <View style={styles.scareFace}>
              <Ionicons color={colors.white} name="skull" size={170} />
              <Text style={styles.scareText}>GOTCHA!</Text>
            </View>
          ) : (
            <View style={styles.decoy}>
              <Text style={styles.prompt}>
                {status === 'gotcha' ? 'Ready for another one?' : prompt}
              </Text>
              <View style={styles.dotPuzzle}>
                <View style={styles.puzzleDot} />
              </View>
              <Text style={styles.hint}>
                {status === 'gotcha' ? 'TAP TO RESTART' : 'Take your time...'}
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
      <Text style={styles.prankLabel}>PRANK</Text>
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
      <DisclaimerModal onClose={() => setShowDisclaimer(false)} visible={showDisclaimer} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.ink, flex: 1 },
  decoy: { alignItems: 'center', paddingHorizontal: 28 },
  disclaimer: {
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 12,
    opacity: 0.4,
    textAlign: 'center',
  },
  dotPuzzle: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 180,
    justifyContent: 'center',
    marginVertical: 42,
    width: 180,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hint: { color: colors.gray, fontFamily: 'SpaceMono_400Regular', fontSize: 11, letterSpacing: 1 },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  prankLabel: {
    color: colors.bloodRed,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
  prompt: {
    color: colors.offWhite,
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    lineHeight: 30,
    textAlign: 'center',
  },
  puzzleDot: { backgroundColor: colors.bloodRed, borderRadius: 8, height: 16, width: 16 },
  scareFace: {
    alignItems: 'center',
    backgroundColor: colors.bloodRed,
    borderRadius: 150,
    height: 300,
    justifyContent: 'center',
    width: 300,
  },
  scareText: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    letterSpacing: 3,
    marginTop: 14,
  },
  touchArea: { alignItems: 'center', flex: 1, justifyContent: 'center' },
})
