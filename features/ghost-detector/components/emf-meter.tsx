import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { colors } from '@/shared/constants/colors'
import type { GhostLevel } from '@/features/ghost-detector/types/ghost-types'

interface EmfMeterProps {
  entity: string
  level: GhostLevel
  reading: number
}

export function EmfMeter({ entity, level, reading }: EmfMeterProps) {
  const readingProgress = useSharedValue(reading / 10)
  const barFillStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: readingProgress.value }] }))

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>EMF READING</Text>
      <View style={styles.readingRow}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, barFillStyle]} />
        </View>
        <Text style={styles.reading}>{reading.toFixed(1)} mG</Text>
      </View>
      <Text style={styles.level}>LEVEL: {level}</Text>
      <Text style={styles.entity}>Entity: {entity}</Text>
      <Text style={styles.distance}>Distance: {(1.2 + reading * 0.73).toFixed(1)}m</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  barFill: { backgroundColor: colors.ghostPurple, height: 8 },
  barTrack: { backgroundColor: colors.border, flex: 1, height: 8, overflow: 'hidden' },
  container: {
    borderColor: colors.ghostPurple + '66',
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 28,
    padding: 16,
  },
  distance: { color: colors.gray, fontFamily: 'SpaceMono_400Regular', fontSize: 11, marginTop: 8 },
  entity: {
    color: colors.offWhite,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    marginTop: 8,
  },
  heading: {
    color: colors.ghostPurple,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 12,
  },
  level: { color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 10 },
  reading: {
    color: colors.white,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    marginLeft: 10,
  },
  readingRow: { alignItems: 'center', flexDirection: 'row' },
})
