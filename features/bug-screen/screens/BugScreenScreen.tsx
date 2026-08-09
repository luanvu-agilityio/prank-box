import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Ellipse, Path } from 'react-native-svg'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { BUG_CONFIG } from '@/features/bug-screen/constants/bug-config'
import type { BugPosition } from '@/features/bug-screen/types/bug-types'
import { colors } from '@/shared/constants/colors'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'

const generateBugPosition = (width: number, height: number): BugPosition => ({
  x: Math.random() * (width - BUG_CONFIG.bugSize - 40) + 20,
  y: Math.random() * (height - BUG_CONFIG.bugSize - 200) + 100,
  rotation: Math.random() * 360,
})

export const BugScreenScreen = () => {
  const router = useRouter()
  const { width, height } = useWindowDimensions()
  const bugX = useSharedValue(width / 2)
  const bugY = useSharedValue(height / 2)
  const bugRotation = useSharedValue(0)
  const [scurryCount, setScurryCount] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const bugStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: bugX.value },
      { translateY: bugY.value },
      { rotate: `${bugRotation.value}deg` },
    ],
  }))

  useEffect(() => {
    const startPos = generateBugPosition(width, height)
    bugX.value = startPos.x
    bugY.value = startPos.y
    bugRotation.value = startPos.rotation

    const moveBug = () => {
      const nextPos = generateBugPosition(width, height)
      bugX.value = withTiming(nextPos.x, { duration: BUG_CONFIG.moveDuration })
      bugY.value = withTiming(nextPos.y, { duration: BUG_CONFIG.moveDuration })
      bugRotation.value = withTiming(nextPos.rotation, { duration: BUG_CONFIG.moveDuration })
      moveTimerRef.current = setTimeout(moveBug, BUG_CONFIG.moveDuration + BUG_CONFIG.pauseDuration)
    }
    moveTimerRef.current = setTimeout(moveBug, BUG_CONFIG.pauseDuration)

    const hintTimer = setTimeout(() => setShowHint(false), 3000)

    return () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current)
      clearTimeout(hintTimer)
      cancelAnimation(bugX)
      cancelAnimation(bugY)
      cancelAnimation(bugRotation)
    }
  }, [bugRotation, bugX, bugY, width, height])

  const handleScreenTap = (x: number, y: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setScurryCount((current) => current + 1)
    const escapeAngle = Math.atan2(bugY.value - y, bugX.value - x)
    const distance = 120
    let nextX = bugX.value + Math.cos(escapeAngle) * distance
    let nextY = bugY.value + Math.sin(escapeAngle) * distance
    nextX = Math.max(20, Math.min(width - BUG_CONFIG.bugSize - 20, nextX))
    nextY = Math.max(80, Math.min(height - BUG_CONFIG.bugSize - 120, nextY))
    const nextRotation = (escapeAngle * 180) / Math.PI

    bugX.value = withTiming(nextX, { duration: BUG_CONFIG.scurryDuration })
    bugY.value = withTiming(nextY, { duration: BUG_CONFIG.scurryDuration })
    bugRotation.value = withTiming(nextRotation, { duration: BUG_CONFIG.scurryDuration })
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <PrankIndicator />
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={handleBack}
        style={styles.backButton}
      >
        <Ionicons color={colors.bugGreen} name="chevron-back" size={24} />
      </Pressable>
      <Pressable
        accessibilityLabel="Tap to chase the bug"
        accessibilityRole="button"
        onPress={(event) => {
          const { locationX, locationY } = event.nativeEvent
          handleScreenTap(locationX, locationY)
        }}
        style={styles.touchArea}
      >
        {showHint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>There is a bug on your phone. Tap to chase it.</Text>
          </View>
        )}
        <Animated.View style={[styles.bugContainer, bugStyle]}>
          <Svg height={BUG_CONFIG.bugSize} width={BUG_CONFIG.bugSize}>
            <Ellipse cx="24" cy="26" fill="#3D2B1F" rx="14" ry="16" />
            <Ellipse cx="24" cy="14" fill="#2A1A10" rx="9" ry="7" />
            <Path d="M 24 14 L 24 6" stroke="#2A1A10" strokeWidth="1.5" />
            <Path d="M 20 8 Q 14 4 10 2" fill="none" stroke="#2A1A10" strokeWidth="1" />
            <Path d="M 28 8 Q 34 4 38 2" fill="none" stroke="#2A1A10" strokeWidth="1" />
            <Path
              d="M 10 22 Q 2 18 0 14"
              fill="none"
              stroke="#3D2B1F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M 38 22 Q 46 18 48 14"
              fill="none"
              stroke="#3D2B1F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M 12 30 Q 6 32 2 36"
              fill="none"
              stroke="#3D2B1F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M 36 30 Q 42 32 46 36"
              fill="none"
              stroke="#3D2B1F"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
        {scurryCount > 3 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{scurryCount} taps and still no bug squashed.</Text>
          </View>
        )}
      </Pressable>
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    left: 16,
    position: 'absolute',
    top: 8,
    width: 44,
    zIndex: 10,
  },
  bugContainer: {
    height: 48,
    position: 'absolute',
    width: 48,
  },
  container: { backgroundColor: '#1a1a1a', flex: 1 },
  counterContainer: {
    backgroundColor: `${colors.bugGreen}20`,
    borderRadius: 10,
    bottom: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
  },
  counterText: {
    color: colors.bugGreen,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  disclaimer: {
    color: `${colors.white}66`,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 12,
    textAlign: 'center',
  },
  hintContainer: {
    alignItems: 'center',
    top: 120,
  },
  hintText: {
    color: `${colors.bugGreen}99`,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  touchArea: { flex: 1, position: 'relative' },
})
