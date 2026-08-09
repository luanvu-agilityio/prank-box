import { Ionicons } from '@expo/vector-icons'
import { Audio, type AVPlaybackStatus } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { Pressable, Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import glassCrack from '@/assets/sounds/glass-crack.mp3'
import { colors } from '@/shared/constants/colors'
import { DisclaimerModal } from '@/shared/ui/DisclaimerModal'
import type { Crack } from '@/features/crack-screen/types/crack-types'
import { createCrackPath } from '@/features/crack-screen/utils/create-crack-path'
import { useAppStore } from '@/stores/useAppStore'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'

export const CrackScreen = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const [cracks, setCracks] = useState<Crack[]>([])
  const [showReset, setShowReset] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)
  const nextCrackId = useRef(0)
  const flash = useSharedValue(0)
  const hintOpacity = useSharedValue(1)
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }))
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value }))

  useEffect(() => {
    const hideHint = () => {
      hintOpacity.value = withTiming(0, { duration: 500 })
    }
    const hintTimer = setTimeout(hideHint, 3000)
    return () => {
      clearTimeout(hintTimer)
      void soundRef.current?.unloadAsync()
    }
  }, [hintOpacity])

  const handleSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      void soundRef.current?.unloadAsync()
      soundRef.current = null
    }
  }

  const playCrackSound = async () => {
    if (!soundEnabled) return
    await soundRef.current?.unloadAsync()
    const { sound } = await Audio.Sound.createAsync(glassCrack, { shouldPlay: true, volume: 0.85 })
    soundRef.current = sound
    sound.setOnPlaybackStatusUpdate(handleSoundStatus)
  }

  const triggerFeedback = () => {
    if (hapticsEnabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    const completeFlash = () => {
      flash.value = withTiming(0, { duration: 100 })
    }
    flash.value = withTiming(0.8, { duration: 45 }, completeFlash)
    void playCrackSound()
  }

  const handleTap = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent
    const crack = { id: nextCrackId.current, path: createCrackPath(locationX, locationY) }
    nextCrackId.current += 1
    const appendCrack = (current: Crack[]) => [...current, crack]
    setCracks(appendCrack)
    triggerFeedback()
  }

  const handleLongPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setShowReset(true)
  }

  const handleReset = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setCracks([])
    setShowReset(false)
  }

  const handleBackPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  const handleDisclaimerOpen = () => setShowDisclaimer(true)
  const handleDisclaimerClose = () => setShowDisclaimer(false)
  const renderCrack = (crack: Crack) => (
    <Path
      d={crack.path}
      key={crack.id}
      fill="none"
      stroke={colors.iceBlue}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  )

  const headerTop = insets.top + 8
  const screenInsets = { paddingBottom: insets.bottom, paddingTop: insets.top }

  return (
    <View className="flex-1 bg-ink" style={screenInsets}>
      <PrankIndicator />
      <Animated.View
        className="absolute inset-0 z-10 bg-white"
        pointerEvents="none"
        style={flashStyle}
      />
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        className="absolute left-5 z-20 h-11 w-11 items-center justify-center rounded-xl bg-white/10"
        onPress={handleBackPress}
        style={{ top: headerTop }}
      >
        <Ionicons color={colors.iceBlue} name="chevron-back" size={24} />
      </Pressable>
      <Pressable
        accessibilityLabel="Show disclaimer"
        accessibilityRole="button"
        className="absolute right-5 z-20 h-11 w-11 items-center justify-center rounded-xl bg-white/10"
        onPress={handleDisclaimerOpen}
        style={{ top: headerTop }}
      >
        <Ionicons color={colors.gray} name="warning-outline" size={20} />
      </Pressable>
      <Pressable
        accessibilityLabel="Tap anywhere to crack the screen"
        accessibilityRole="button"
        className="flex-1"
        onLongPress={handleLongPress}
        onPress={handleTap}
        delayLongPress={2000}
      >
        <Svg height={height} width={width}>
          {cracks.map(renderCrack)}
        </Svg>
        {cracks.length === 0 && (
          <Animated.View className="absolute inset-0 items-center justify-center" style={hintStyle}>
            <Text className="font-mono text-micro tracking-electric text-ice-blue">
              TAP ANYWHERE TO CRACK
            </Text>
          </Animated.View>
        )}
      </Pressable>
      {showReset && (
        <Pressable
          accessibilityRole="button"
          onPress={handleReset}
          className="absolute bottom-14 self-center rounded-control bg-ice-blue px-5 py-3"
        >
          <Text className="font-inter-bold text-caption text-ink">RESET CRACKS</Text>
        </Pressable>
      )}
      <Text className="pb-4 text-center font-inter text-micro text-white/40">
        For entertainment purposes only · Long press to reset
      </Text>
      <DisclaimerModal onClose={handleDisclaimerClose} visible={showDisclaimer} />
    </View>
  )
}
