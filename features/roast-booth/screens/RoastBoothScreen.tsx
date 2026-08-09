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
import { ROASTS, ROAST_CONFIG } from '@/features/roast-booth/constants/roast-config'
import type { RoastStage } from '@/features/roast-booth/types/roast-types'
import { colors } from '@/shared/constants/colors'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'

export const RoastBoothScreen = () => {
  const router = useRouter()
  const [stage, setStage] = useState<RoastStage>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [roastIndex, setRoastIndex] = useState(0)
  const scanLine = useSharedValue(0)
  const scanProgress = useSharedValue(0)
  const resultScale = useSharedValue(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLine.value }],
  }))
  const progressBarStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scanProgress.value }],
  }))
  const resultStyle = useAnimatedStyle(() => ({
    opacity: resultScale.value,
    transform: [{ scale: resultScale.value }],
  }))

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      cancelAnimation(scanLine)
      cancelAnimation(scanProgress)
      cancelAnimation(resultScale)
    }
  }, [scanLine, scanProgress, resultScale])

  const startScan = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStage('scanning')
    setStepIndex(0)
    scanLine.value = 0
    scanProgress.value = 0

    scanLine.value = withRepeat(
      withSequence(withTiming(280, { duration: 800 }), withTiming(0, { duration: 800 })),
      -1,
    )
    scanProgress.value = withTiming(1, { duration: ROAST_CONFIG.scanDuration })

    let elapsed = 0
    const stepInterval = ROAST_CONFIG.scanDuration / ROAST_CONFIG.scanSteps.length
    const advanceStep = () => {
      setStepIndex((current) => Math.min(current + 1, ROAST_CONFIG.scanSteps.length - 1))
      elapsed += stepInterval
      if (elapsed < ROAST_CONFIG.scanDuration) {
        timerRef.current = setTimeout(advanceStep, stepInterval)
      } else {
        finishScan()
      }
    }
    timerRef.current = setTimeout(advanceStep, stepInterval)
  }

  const finishScan = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const nextRoast = Math.floor(Math.random() * ROASTS.length)
    setRoastIndex(nextRoast)
    setStage('result')
    resultScale.value = withTiming(1, { duration: 400 })
  }

  const handleRestart = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    resultScale.value = 0
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
          <Ionicons color={colors.roastFlame} name="chevron-back" size={24} />
        </Pressable>
      </View>
      <View style={styles.content}>
        {stage === 'idle' && (
          <>
            <View style={styles.scanFrame}>
              <Ionicons color={`${colors.roastFlame}40`} name="scan-outline" size={160} />
              <View style={styles.faceGuide} />
            </View>
            <Text style={styles.title}>ROAST BOOTH</Text>
            <Text style={styles.subtitle}>
              Place your face in the frame and prepare to get roasted by AI
            </Text>
            <Pressable
              accessibilityLabel="Start face scan"
              accessibilityRole="button"
              onPress={startScan}
              style={styles.scanButton}
            >
              <Text style={styles.scanButtonText}>SCAN MY FACE</Text>
            </Pressable>
          </>
        )}
        {stage === 'scanning' && (
          <>
            <View style={styles.scanFrame}>
              <View style={styles.scanArea} />
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
              <Ionicons
                color={`${colors.roastFlame}60`}
                name="happy-outline"
                size={120}
                style={styles.faceIcon}
              />
            </View>
            <Text style={styles.scanningText}>{ROAST_CONFIG.scanSteps[stepIndex]}</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressBarStyle]} />
            </View>
          </>
        )}
        {stage === 'result' && (
          <Animated.View style={[styles.resultContainer, resultStyle]}>
            <Ionicons color={colors.roastFlame} name="flame" size={72} />
            <Text style={styles.roastLabel}>AI ROAST RESULT</Text>
            <Text style={styles.roastText}>{ROASTS[roastIndex]}</Text>
            <Pressable
              accessibilityLabel="Get roasted again"
              accessibilityRole="button"
              onPress={handleRestart}
              style={styles.restartButton}
            >
              <Text style={styles.restartButtonText}>GET ROASTED AGAIN</Text>
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
  faceGuide: {
    aspectRatio: 1,
    borderColor: `${colors.roastFlame}40`,
    borderRadius: 80,
    borderWidth: 2,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  faceIcon: { position: 'absolute', zIndex: 1 },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 8 },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  progressFill: {
    backgroundColor: colors.roastFlame,
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
    width: 220,
  },
  restartButton: {
    alignItems: 'center',
    backgroundColor: colors.roastFlame,
    borderRadius: 14,
    marginTop: 36,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  restartButtonText: {
    color: colors.ink,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  resultContainer: { alignItems: 'center', paddingHorizontal: 16 },
  roastLabel: {
    color: colors.roastFlame,
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 16,
  },
  roastText: {
    color: colors.offWhite,
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 16,
    textAlign: 'center',
  },
  scanArea: {
    backgroundColor: `${colors.roastFlame}08`,
    borderRadius: 80,
    height: 280,
    width: 280,
  },
  scanButton: {
    alignItems: 'center',
    backgroundColor: colors.roastFlame,
    borderRadius: 14,
    marginTop: 36,
    paddingHorizontal: 36,
    paddingVertical: 16,
  },
  scanButtonText: {
    color: colors.ink,
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  scanFrame: {
    alignItems: 'center',
    height: 280,
    justifyContent: 'center',
    position: 'relative',
    width: 280,
  },
  scanLine: {
    backgroundColor: `${colors.roastFlame}80`,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: colors.roastFlame,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    width: '100%',
    zIndex: 2,
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
  title: {
    color: colors.roastFlame,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    letterSpacing: 2,
    marginTop: 24,
  },
})
