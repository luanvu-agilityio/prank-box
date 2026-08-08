import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import type { GhostDotData } from '@/features/ghost-detector/types/ghost-types'

interface GhostDotProps {
  dot: GhostDotData
}

export function GhostDot({ dot }: GhostDotProps) {
  const opacity = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: dot.color,
    left: dot.x,
    opacity: opacity.value,
    top: dot.y,
  }))

  opacity.value = withSequence(
    withTiming(1, { duration: 500 }),
    withTiming(1, { duration: 4_000 }),
    withTiming(0, { duration: 800 }),
  )

  return <Animated.View style={[styles.dot, animatedStyle]} />
}

const styles = StyleSheet.create({
  dot: { borderRadius: 7, height: 14, position: 'absolute', width: 14 },
})
