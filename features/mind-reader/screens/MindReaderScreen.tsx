import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import {
  MIND_READINGS,
  MIND_READER_CONFIG,
} from '@/features/mind-reader/constants/mind-reader-config'
import type { MindReaderStage } from '@/features/mind-reader/types/mind-reader-types'
import { colors } from '@/shared/constants/colors'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'

export const MindReaderScreen = () => {
  const router = useRouter()
  const [stage, setStage] = useState<MindReaderStage>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [readingIndex, setReadingIndex] = useState(0)
  const ringScale = useSharedValue(1)
  const scanProgress = useSharedValue(0)
  const resultOpacity = useSharedValue(0)
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }))
  const progressBarStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scanProgress.value }],
  }))
  const resultStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ scale: resultOpacity.value }],
  }))

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      cancelAnimation(ringScale)
      cancelAnimation(scanProgress)
      cancelAnimation(resultOpacity)
    }
  }, [ringScale, scanProgress, resultOpacity])

  const handlePressIn = () => {
    ringScale.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 400 }), withTiming(1, { duration: 400 })),
      -1,
    )

    setStage('scanning')
    setStepIndex(0)
    scanProgress.value = 0
    scanProgress.value = withTiming(1, { duration: MIND_READER_CONFIG.scanDuration })

    let elapsed = 0
    const stepInterval = MIND_READER_CONFIG.scanDuration / MIND_READER_CONFIG.scanSteps.length
    const advanceStep = () => {
      setStepIndex((current) => Math.min(current + 1, MIND_READER_CONFIG.scanSteps.length - 1))
      elapsed += stepInterval
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      if (elapsed < MIND_READER_CONFIG.scanDuration) {
        timerRef.current = setTimeout(advanceStep, stepInterval)
      } else {
        finishScan()
      }
    }
    timerRef.current = setTimeout(advanceStep, stepInterval)
  }

  const finishScan = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const nextReading = Math.floor(Math.random() * MIND_READINGS.length)
    setReadingIndex(nextReading)
    setStage('result')
    resultOpacity.value = withTiming(1, { duration: 500 })
  }

  const handleRestart = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    resultOpacity.value = 0
    setStage('idle')
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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
          <Ionicons color={colors.mindCyan} name="chevron-back" size={24} />
        </Pressable>
      </View>
      <View style={styles.content}>
        {stage === 'idle' && (
          <>
            <Ionicons color={colors.mindCyan} name="pulse-outline" size={80} />
            <Text style={styles.title}>MIND READER</Text>
            <Text style={styles.subtitle}>
              Press and hold your thumb on the scanner. I will read your deepest thoughts.
            </Text>
            <Pressable
              accessibilityLabel="Start mind scan"
              accessibilityRole="button"
              onPressIn={handlePressIn}
              style={({ pressed }) => [styles.thumbScanner, pressed && styles.thumbScannerPressed]}
            >
              <Ionicons color={`${colors.mindCyan}80`} name="finger-print" size={64} />
            </Pressable>
            <Text style={styles.holdHint}>Press and hold to scan</Text>
          </>
        )}
        {stage === 'scanning' && (
          <>
            <Animated.View style={[styles.scannerRing, pulseStyle]}>
              <Ionicons color={colors.mindCyan} name="pulse" size={80} />
            </Animated.View>
            <Text style={styles.scanningText}>{MIND_READER_CONFIG.scanSteps[stepIndex]}</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressBarStyle]} />
            </View>
            <Text style={styles.neuralHint}>Keep holding... do not break the neural link</Text>
          </>
        )}
        {stage === 'result' && (
          <Animated.View style={[styles.resultContainer, resultStyle]}>
            <Ionicons color={colors.mindCyan} name="megaphone-outline" size={56} />
            <Text style={styles.resultLabel}>NEURAL SCAN COMPLETE</Text>
            <Text style={styles.thoughtLabel}>YOUR THOUGHT:</Text>
            <Text style={styles.thoughtText}>{MIND_READINGS[readingIndex]}</Text>
            <Pressable
              accessibilityLabel="Scan again"
              accessibilityRole="button"
              onPress={handleRestart}
              style={styles.restartButton}
            >
              <Text style={styles.restartButtonText}>READ MY MIND AGAIN</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.ink, flex: 1 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  disclaimer: {
    color: `${colors.white}66`,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 12,
    textAlign: 'center',
  },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 8 },
  holdHint: {
    color: colors.gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 12,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  neuralHint: {
    color: `${colors.mindCyan}80`,
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 14,
    textAlign: 'center',
  },
  progressFill: {
    backgroundColor: colors.mindCyan,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    transformOrigin: 'left center',
    width: '100%',
  },
  progressTrack: {
    backgroundColor: colors.border,
    borderRadius: 3,
    height: 6,
    marginTop: 24,
    overflow: 'hidden',
    width: 240,
  },
  restartButton: {
    alignItems: 'center',
    backgroundColor: colors.mindCyan,
    borderRadius: 14,
    marginTop: 32,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  restartButtonText: {
    color: colors.ink,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  resultContainer: { alignItems: 'center', paddingHorizontal: 16 },
  resultLabel: {
    color: colors.mindCyan,
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 14,
  },
  scannerRing: {
    alignItems: 'center',
    borderColor: colors.mindCyan,
    borderRadius: 80,
    borderWidth: 2,
    height: 160,
    justifyContent: 'center',
    width: 160,
  },
  scanningText: {
    color: colors.gray,
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    textAlign: 'center',
  },
  thoughtLabel: {
    color: colors.gray,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 20,
  },
  thoughtText: {
    color: colors.offWhite,
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 12,
    textAlign: 'center',
  },
  thumbScanner: {
    alignItems: 'center',
    borderColor: colors.mindCyan,
    borderRadius: 60,
    borderWidth: 2,
    height: 120,
    justifyContent: 'center',
    marginTop: 32,
    width: 120,
  },
  thumbScannerPressed: {
    backgroundColor: `${colors.mindCyan}15`,
    transform: [{ scale: 0.95 }],
  },
  title: {
    color: colors.mindCyan,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    letterSpacing: 2,
    marginTop: 24,
  },
})
