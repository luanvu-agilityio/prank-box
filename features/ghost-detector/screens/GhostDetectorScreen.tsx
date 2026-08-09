import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ghostAmbient from '@/assets/sounds/ghost-ambient.mp3'
import { EmfMeter } from '@/features/ghost-detector/components/EmfMeter'
import { RadarView } from '@/features/ghost-detector/components/RadarView'
import { GHOST_CONFIG, GHOST_TYPES } from '@/features/ghost-detector/constants/ghost-config'
import type { GhostDotData, GhostLevel } from '@/features/ghost-detector/types/ghost-types'
import { colors } from '@/shared/constants/colors'
import { DisclaimerModal } from '@/shared/ui/DisclaimerModal'
import { PrankIndicator } from '@/shared/ui/PrankIndicator'
import { useAppStore } from '@/stores/useAppStore'

const DOT_COLORS = [colors.white, colors.bloodRed, colors.ghostPurple]

export const GhostScreen = () => {
  const router = useRouter()
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const hapticsEnabled = useAppStore((state) => state.hapticsEnabled)
  const [dots, setDots] = useState<GhostDotData[]>([])
  const [reading, setReading] = useState(3.2)
  const [entity, setEntity] = useState<string>(GHOST_TYPES[0])
  const [level, setLevel] = useState<GhostLevel>('MODERATE')
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)
  const dotIdRef = useRef(0)
  const emfTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const highWarningRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    const loadAmbient = async () => {
      if (!soundEnabled) return
      const { sound } = await Audio.Sound.createAsync(ghostAmbient, {
        isLooping: true,
        shouldPlay: true,
        volume: 0.25,
      })
      if (cancelled) {
        await sound.unloadAsync().catch(() => undefined)
        return
      }
      soundRef.current = sound
    }
    void loadAmbient()

    const updateEmf = () => {
      const nextReading = 2 + Math.random() * 8
      const nextLevel: GhostLevel =
        nextReading >= 8
          ? 'EXTREME'
          : nextReading >= 6
            ? 'HIGH'
            : nextReading >= 4
              ? 'MODERATE'
              : 'CALM'
      setReading(nextReading)
      setLevel(nextLevel)
      setEntity(GHOST_TYPES[Math.floor(Math.random() * GHOST_TYPES.length)])
      if (nextReading >= 8 && !highWarningRef.current) {
        highWarningRef.current = true
        if (hapticsEnabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      }
      if (nextReading < 8) highWarningRef.current = false
    }
    emfTimerRef.current = setInterval(updateEmf, 2_000)

    const addDot = () => {
      const angle = Math.random() * Math.PI * 2
      const radius = 35 + Math.random() * 90
      const center = GHOST_CONFIG.radarSize / 2
      const nextDot = {
        id: dotIdRef.current,
        x: center + Math.cos(angle) * radius - 7,
        y: center + Math.sin(angle) * radius - 7,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
      }
      dotIdRef.current += 1
      setDots((currentDots) => [...currentDots.slice(-3), nextDot])
      dotTimerRef.current = setTimeout(addDot, 2_000 + Math.random() * 2_000)
    }
    addDot()

    return () => {
      cancelled = true
      if (emfTimerRef.current) clearInterval(emfTimerRef.current)
      if (dotTimerRef.current) clearTimeout(dotTimerRef.current)
      const sound = soundRef.current
      soundRef.current = null
      void sound?.unloadAsync().catch(() => undefined)
    }
  }, [hapticsEnabled, soundEnabled])

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
          <Ionicons color={colors.ghostPurple} name="chevron-back" size={24} />
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
      <View style={styles.content}>
        <Text style={styles.status}>SCANNING...</Text>
        <RadarView dots={dots} />
        <Text style={styles.analyzing}>ANALYZING ENVIRONMENT</Text>
        <EmfMeter entity={entity} level={level} reading={reading} />
        {level === 'EXTREME' && <Text style={styles.warning}>⚠ ENTITY DETECTED NEARBY</Text>}
      </View>
      <Text style={styles.disclaimer}>For entertainment purposes only</Text>
      <DisclaimerModal onClose={() => setShowDisclaimer(false)} visible={showDisclaimer} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  analyzing: {
    color: colors.gray,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 18,
  },
  container: { backgroundColor: colors.ink, flex: 1 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center' },
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
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  status: {
    color: colors.ghostPurple,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 24,
  },
  warning: {
    color: colors.bloodRed,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    marginTop: 20,
  },
})
