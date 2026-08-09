import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

interface LockBadgeProps {
  isFree: boolean
}

export const LockBadge = ({ isFree }: LockBadgeProps) => (
  <View
    className={
      isFree
        ? 'items-center justify-center rounded-full bg-success/15 px-2 py-1'
        : 'items-center justify-center rounded-full bg-warning/15 p-1.5'
    }
  >
    {isFree ? (
      <Text className="font-inter-bold text-micro tracking-wider text-success">FREE</Text>
    ) : (
      <Ionicons color={colors.warning} name="lock-closed" size={12} />
    )}
  </View>
)
