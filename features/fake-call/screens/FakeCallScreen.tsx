import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import phoneRing from '@/assets/sounds/phone-ring.mp3'
import { DELAY_OPTIONS } from '@/features/fake-call/constants/call-config'
import { FakeCallConnected } from '@/features/fake-call/components/FakeCallConnected'
import { FakeCallHeader } from '@/features/fake-call/components/FakeCallHeader'
import { FakeCallIncoming } from '@/features/fake-call/components/FakeCallIncoming'
import { FakeCallSetup } from '@/features/fake-call/components/FakeCallSetup'
import { FakeCallWaiting } from '@/features/fake-call/components/FakeCallWaiting'
import type { CallStage } from '@/features/fake-call/types/call-types'
import { DisclaimerModal } from '@/shared/ui/DisclaimerModal'
import { colors } from '@/shared/constants/colors'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'
import { useAppStore } from '@/stores/useAppStore'

export const FakeCallScreen = () => {
  const router = useRouter()
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const [stage, setStage] = useState<CallStage>('setup')
  const [callerName, setCallerName] = useState('Mom')
  const [callerNumber, setCallerNumber] = useState('+1 555-0000')
  const [delay, setDelay] = useState(5_000)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)
  const soundOperationRef = useRef(0)
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hapticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pulse = useSharedValue(1)
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }))

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      if (hapticTimerRef.current) clearInterval(hapticTimerRef.current)
      if (callTimerRef.current) clearInterval(callTimerRef.current)
      cancelAnimation(pulse)
      soundOperationRef.current += 1
      const sound = soundRef.current
      soundRef.current = null
      void sound?.unloadAsync().catch(() => undefined)
    }
  }, [pulse])

  const stopRing = async () => {
    if (hapticTimerRef.current) clearInterval(hapticTimerRef.current)
    hapticTimerRef.current = null
    cancelAnimation(pulse)
    pulse.value = withTiming(1, { duration: 150 })
    soundOperationRef.current += 1
    const sound = soundRef.current
    soundRef.current = null
    if (!sound) return
    await sound.stopAsync().catch(() => undefined)
    await sound.unloadAsync().catch(() => undefined)
  }

  const startRing = async () => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 420 }), withTiming(1, { duration: 420 })),
      -1,
    )
    if (hapticsEnabled) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      hapticTimerRef.current = setInterval(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      }, 900)
    }
    if (!soundEnabled) return
    const operation = ++soundOperationRef.current
    const { sound } = await Audio.Sound.createAsync(phoneRing, {
      isLooping: true,
      shouldPlay: true,
      volume: 0.9,
    })
    if (operation !== soundOperationRef.current) {
      await sound.unloadAsync().catch(() => undefined)
      return
    }
    soundRef.current = sound
  }

  const handleStart = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStage('waiting')
    delayTimerRef.current = setTimeout(() => {
      setStage('incoming')
      void startRing()
    }, delay)
  }

  const handleDecline = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    void stopRing()
    setStage('setup')
  }

  const handleAccept = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    void stopRing()
    setElapsedSeconds(0)
    setStage('connected')
    callTimerRef.current = setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1_000)
  }

  const handleEndCall = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (callTimerRef.current) clearInterval(callTimerRef.current)
    callTimerRef.current = null
    setStage('setup')
  }

  const handleBack = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
    if (callTimerRef.current) clearInterval(callTimerRef.current)
    void stopRing()
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <PrankIndicator />
      <FakeCallHeader onBack={handleBack} onShowDisclaimer={() => setShowDisclaimer(true)} />
      {stage === 'setup' && (
        <FakeCallSetup
          callerName={callerName}
          callerNumber={callerNumber}
          delay={delay}
          delayOptions={DELAY_OPTIONS}
          onCallerNameChange={setCallerName}
          onCallerNumberChange={setCallerNumber}
          onDelayChange={setDelay}
          onStart={handleStart}
        />
      )}
      {stage === 'waiting' && (
        <FakeCallWaiting delay={delay} onCancel={handleDecline} pulseStyle={pulseStyle} />
      )}
      {stage === 'incoming' && (
        <FakeCallIncoming
          callerName={callerName}
          callerNumber={callerNumber}
          onAccept={handleAccept}
          onDecline={handleDecline}
          pulseStyle={pulseStyle}
        />
      )}
      {stage === 'connected' && (
        <FakeCallConnected
          callerName={callerName}
          elapsedSeconds={elapsedSeconds}
          isMuted={isMuted}
          isSpeakerOn={isSpeakerOn}
          onEndCall={handleEndCall}
          onToggleMute={() => setIsMuted((muted) => !muted)}
          onToggleSpeaker={() => setIsSpeakerOn((speaker) => !speaker)}
        />
      )}
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
      <DisclaimerModal onClose={() => setShowDisclaimer(false)} visible={showDisclaimer} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.ink, flex: 1 },
  disclaimer: {
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 12,
    opacity: 0.4,
    textAlign: 'center',
  },
})
