import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { FAKE_APPS, STORAGE_CONFIG } from '@/features/storage-full/constants/storage-config'
import type { StorageStage } from '@/features/storage-full/types/storage-types'
import { colors } from '@/shared/constants/colors'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'

export const StorageFullScreen = () => {
  const router = useRouter()
  const [stage, setStage] = useState<StorageStage>('filling')
  const [usedGB, setUsedGB] = useState(42)
  const fillProgress = useSharedValue(42 / 128)
  const warningOpacity = useSharedValue(0)
  const revealScale = useSharedValue(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fillBarStyle = useAnimatedStyle(() => ({
    width: `${fillProgress.value * 100}%`,
  }))
  const warningStyle = useAnimatedStyle(() => ({ opacity: warningOpacity.value }))
  const revealStyle = useAnimatedStyle(() => ({
    opacity: revealScale.value,
    transform: [{ scale: revealScale.value }],
  }))

  useEffect(() => {
    fillProgress.value = withTiming(1, { duration: STORAGE_CONFIG.fillDuration })
    const interval = STORAGE_CONFIG.fillDuration / (STORAGE_CONFIG.totalStorageGB - 42)
    timerRef.current = setInterval(() => {
      setUsedGB((current) => {
        const next = Math.min(current + 1, STORAGE_CONFIG.totalStorageGB)
        if (next >= STORAGE_CONFIG.totalStorageGB) {
          if (timerRef.current) clearInterval(timerRef.current)
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          setStage('full')
          warningOpacity.value = withTiming(1, { duration: 300 })
          revealTimerRef.current = setTimeout(() => setStage('reveal'), 6000)
        }
        return next
      })
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
      cancelAnimation(fillProgress)
      cancelAnimation(warningOpacity)
      cancelAnimation(revealScale)
    }
  }, [fillProgress, revealScale, warningOpacity])

  const handleReveal = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
    setStage('reveal')
    revealScale.value = withTiming(1, { duration: 400 })
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  const isFull = stage === 'full' || stage === 'reveal'
  const usedPercent = Math.round((usedGB / STORAGE_CONFIG.totalStorageGB) * 100)

  return (
    <SafeAreaView style={styles.container}>
      <PrankIndicator />
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={handleBack}
        style={styles.backButton}
      >
        <Ionicons color={colors.storageBlue} name="chevron-back" size={24} />
      </Pressable>
      <View style={styles.content}>
        {stage === 'reveal' ? (
          <Animated.View style={[styles.revealContainer, revealStyle]}>
            <Ionicons color={colors.success} name="checkmark-circle" size={80} />
            <Text style={styles.revealTitle}>YOU FINE</Text>
            <Text style={styles.revealSubtitle}>
              You had {STORAGE_CONFIG.totalStorageGB}GB free the whole time. Chill.
            </Text>
            <Text style={styles.revealRoast}>
              You almost deleted your photos for nothing. PRANK!
            </Text>
          </Animated.View>
        ) : (
          <>
            <View style={styles.headerSection}>
              <Ionicons
                color={isFull ? colors.error : colors.storageBlue}
                name={isFull ? 'warning' : 'cloud'}
                size={56}
              />
              <Text style={[styles.headerTitle, isFull && { color: colors.error }]}>
                {isFull ? 'STORAGE FULL' : 'iPhone Storage'}
              </Text>
            </View>
            <View style={styles.storageBar}>
              <Animated.View
                style={[
                  styles.storageFill,
                  isFull && { backgroundColor: colors.error },
                  fillBarStyle,
                ]}
              />
            </View>
            <Text style={styles.storageText}>
              {usedGB} GB used{isFull ? ' · 0 bytes free' : ` · ${usedPercent}%`}
            </Text>
            {isFull && (
              <Animated.View style={[styles.warningSection, warningStyle]}>
                <Text style={styles.warningTitle}>Cannot Take Photo</Text>
                <Text style={styles.warningBody}>
                  There is not enough available storage to take a photo. You can manage your storage
                  in Settings.
                </Text>
                <View style={styles.appList}>
                  {FAKE_APPS.slice(0, 4).map((app) => (
                    <View key={app} style={styles.appRow}>
                      <Ionicons color={colors.gray} name="apps" size={20} />
                      <Text style={styles.appName} numberOfLines={1}>
                        {app}
                      </Text>
                      <Text style={styles.appSize}>2.1 GB</Text>
                    </View>
                  ))}
                </View>
                <Pressable
                  accessibilityLabel="Manage storage in settings"
                  accessibilityRole="button"
                  onPress={handleReveal}
                  style={styles.settingsButton}
                >
                  <Text style={styles.settingsButtonText}>Go to Settings</Text>
                </Pressable>
              </Animated.View>
            )}
          </>
        )}
      </View>
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  appList: { marginTop: 16, width: '100%' },
  appName: {
    color: colors.white,
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginLeft: 10,
  },
  appRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  appSize: { color: colors.gray, fontFamily: 'Inter_400Regular', fontSize: 13 },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginLeft: 16,
    width: 44,
  },
  container: { backgroundColor: colors.ink, flex: 1 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  disclaimer: {
    color: `${colors.white}66`,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSection: { alignItems: 'center' },
  headerTitle: {
    color: colors.storageBlue,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    letterSpacing: 1,
    marginTop: 12,
  },
  revealContainer: { alignItems: 'center', paddingHorizontal: 16 },
  revealRoast: {
    color: colors.warning,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  revealSubtitle: {
    color: colors.offWhite,
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 16,
    textAlign: 'center',
  },
  revealTitle: {
    color: colors.success,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    letterSpacing: 2,
    marginTop: 16,
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: colors.storageBlue,
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  settingsButtonText: {
    color: colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  storageBar: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 10,
    marginTop: 20,
    overflow: 'hidden',
    width: 260,
  },
  storageFill: {
    backgroundColor: colors.storageBlue,
    height: '100%',
    position: 'absolute',
  },
  storageText: {
    color: colors.gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 8,
  },
  warningBody: {
    color: colors.gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  warningSection: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  warningTitle: {
    color: colors.error,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
})
