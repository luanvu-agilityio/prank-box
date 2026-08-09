import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { GHOST_CONFIG } from '@/features/ghost-detector/constants/ghost-config'
import { GhostDot } from '@/features/ghost-detector/components/GhostDot'
import type { GhostDotData } from '@/features/ghost-detector/types/ghost-types'
import { colors } from '@/shared/constants/colors'

interface RadarViewProps {
  dots: GhostDotData[]
}

export const RadarView = ({ dots }: RadarViewProps) => {
  const rotation = useSharedValue(0)
  const sweepStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }))
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: GHOST_CONFIG.sweepDuration }), -1)
  }, [rotation])

  return (
    <View style={styles.radar}>
      <View style={styles.ringOuter} />
      <View style={styles.ringMiddle} />
      <View style={styles.ringInner} />
      <Animated.View style={[styles.sweep, sweepStyle]} />
      {dots.map((dot) => (
        <GhostDot dot={dot} key={dot.id} />
      ))}
      <View style={styles.youDot} />
    </View>
  )
}

const styles = StyleSheet.create({
  radar: {
    backgroundColor: `${colors.ghostPurple}12`,
    borderColor: colors.ghostPurple,
    borderRadius: GHOST_CONFIG.radarSize / 2,
    borderWidth: 1,
    height: GHOST_CONFIG.radarSize,
    overflow: 'hidden',
    position: 'relative',
    width: GHOST_CONFIG.radarSize,
  },
  ringInner: {
    borderColor: `${colors.ghostPurple}55`,
    borderRadius: 50,
    borderWidth: 1,
    height: 100,
    left: 90,
    position: 'absolute',
    top: 90,
    width: 100,
  },
  ringMiddle: {
    borderColor: `${colors.ghostPurple}55`,
    borderRadius: 100,
    borderWidth: 1,
    height: 200,
    left: 40,
    position: 'absolute',
    top: 40,
    width: 200,
  },
  ringOuter: {
    borderColor: `${colors.ghostPurple}55`,
    borderRadius: 140,
    borderWidth: 1,
    height: 280,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 280,
  },
  sweep: {
    backgroundColor: colors.ghostPurple,
    height: 1,
    left: GHOST_CONFIG.radarSize / 2,
    opacity: 0.8,
    position: 'absolute',
    top: 0,
    transformOrigin: '0% 100%',
    width: GHOST_CONFIG.radarSize / 2,
  },
  youDot: {
    backgroundColor: colors.white,
    borderColor: colors.ghostPurple,
    borderRadius: 7,
    borderWidth: 2,
    height: 14,
    left: 133,
    position: 'absolute',
    top: 133,
    width: 14,
  },
})
