import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { FAKE_UPDATE_CONFIG } from '@/features/fake-update/constants/update-config'
import type { UpdateStage } from '@/features/fake-update/types/update-types'
import { colors } from '@/shared/constants/colors'

export default function FakeUpdateScreen() {
  const router = useRouter()
  const [stage, setStage] = useState<UpdateStage>('installing')
  const [progress, setProgress] = useState(0)
  const tapTimesRef = useRef<number[]>([])
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoOpacity = useSharedValue(0)
  const progressValue = useSharedValue(0)
  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }))
  const progressStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: progressValue.value }] }))

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 })
    progressValue.value = withTiming(1, { duration: FAKE_UPDATE_CONFIG.duration })
    progressTimerRef.current = setInterval(() => {
      setProgress((currentProgress) => {
        const nextProgress = Math.min(100, currentProgress + 1)
        if (nextProgress === 100) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current)
          completeTimerRef.current = setTimeout(() => setStage('complete'), 500)
        }
        return nextProgress
      })
    }, FAKE_UPDATE_CONFIG.duration / 100)

    return () => {
      cancelAnimation(logoOpacity)
      cancelAnimation(progressValue)
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
    }
  }, [logoOpacity, progressValue])

  useEffect(() => {
    if (stage !== 'complete') return
    completeTimerRef.current = setTimeout(() => setStage('lock-screen'), 2_500)
    return () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
    }
  }, [stage])

  const handleLogoPress = () => {
    void Haptics.selectionAsync()
    const now = Date.now()
    const recentTaps = [...tapTimesRef.current, now].filter(
      (tapTime) => now - tapTime <= FAKE_UPDATE_CONFIG.exitTapWindow,
    )
    tapTimesRef.current = recentTaps
    if (recentTaps.length >= FAKE_UPDATE_CONFIG.requiredExitTaps) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.back()
    }
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        accessibilityLabel="Exit fake update"
        accessibilityRole="button"
        onPress={handleBack}
        style={styles.exitButton}
      >
        <Ionicons color={colors.white} name="chevron-down" size={20} />
      </Pressable>
      {stage === 'lock-screen' ? (
        <View style={styles.lockScreen}>
          <Text style={styles.lockTime}>9:41</Text>
          <Text style={styles.lockDate}>Tuesday, August 9</Text>
          <Ionicons color={colors.white} name="lock-closed" size={22} />
          <Text style={styles.lockHint}>Swipe up to unlock</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Pressable
            accessibilityLabel="Fake Apple logo exit control"
            accessibilityRole="button"
            onPress={handleLogoPress}
          >
            <Animated.View style={logoStyle}>
              <Ionicons color={colors.white} name="logo-apple" size={82} />
            </Animated.View>
          </Pressable>
          <Text style={styles.version}>iOS 19.4</Text>
          <Text style={styles.status}>
            {stage === 'complete' ? 'Update Complete' : 'Installing...'}
          </Text>
          {stage === 'installing' && (
            <View style={styles.progressSection}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
              <Text style={styles.percent}>{progress}%</Text>
            </View>
          )}
          <Text style={styles.warning}>Do not turn off your device</Text>
        </View>
      )}
      <Text style={styles.prankLabel}>PRANK</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.ink, flex: 1 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  exitButton: {
    alignItems: 'center',
    backgroundColor: colors.white + '12',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    left: 18,
    position: 'absolute',
    top: 16,
    width: 36,
    zIndex: 2,
  },
  lockDate: { color: colors.white, fontFamily: 'Inter_400Regular', fontSize: 18, marginTop: 8 },
  lockHint: {
    bottom: 50,
    color: colors.white + '99',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    position: 'absolute',
  },
  lockScreen: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  lockTime: { color: colors.white, fontFamily: 'Inter_400Regular', fontSize: 76 },
  percent: { color: colors.white, fontFamily: 'SpaceMono_400Regular', fontSize: 13, marginTop: 12 },
  prankLabel: {
    bottom: 14,
    color: colors.white,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    opacity: 0.3,
    position: 'absolute',
    right: 14,
  },
  progressFill: {
    backgroundColor: colors.white,
    height: 6,
    left: 0,
    position: 'absolute',
    top: 0,
    transformOrigin: 'left center',
    width: '100%',
  },
  progressSection: { alignItems: 'center', marginTop: 42, width: '100%' },
  progressTrack: {
    backgroundColor: colors.white + '44',
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
    width: '100%',
  },
  status: { color: colors.white, fontFamily: 'Inter_400Regular', fontSize: 20, marginTop: 18 },
  version: { color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 28, marginTop: 38 },
  warning: { color: colors.gray, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 34 },
})
