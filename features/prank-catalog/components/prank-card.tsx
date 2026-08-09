import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { cva } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import type { PrankConfig } from '@/features/prank-catalog/data/pranks'
import { LockBadge } from './lock-badge'

interface PrankCardProps {
  prank: PrankConfig
  isLocked: boolean
  onOpen: () => void
  onLockedPress: () => void
}

const cardVariants = cva(
  'h-card flex-1 justify-center overflow-hidden rounded-2xl border-l-4 bg-card p-4',
  {
    variants: { state: { idle: 'opacity-100', locked: 'opacity-75' } },
  },
)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const PrankCard = ({ prank, isLocked, onLockedPress, onOpen }: PrankCardProps) => {
  const router = useRouter()
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (isLocked) {
      onLockedPress()
      return
    }
    onOpen()
    router.push(prank.route)
  }

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 18, stiffness: 300 })
  }
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 300 })
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={cn(cardVariants({ state: isLocked ? 'locked' : 'idle' }), prank.accentClass)}
    >
      <View className="mb-2 h-icon w-icon items-center justify-center rounded-full bg-white/5">
        <Ionicons color={prank.color} name={prank.icon} size={34} />
      </View>
      <Text className="mb-1 font-inter-bold text-lg text-white" numberOfLines={1}>
        {prank.name}
      </Text>
      <Text className="font-inter text-caption text-gray" numberOfLines={1}>
        {prank.description}
      </Text>
      <View className="absolute bottom-4 right-4">
        <LockBadge isFree={!isLocked} />
      </View>
    </AnimatedPressable>
  )
}
