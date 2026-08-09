import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '@/shared/constants/colors'

interface FakeCallWaitingProps {
  delay: number
  onCancel: () => void
  pulseStyle: StyleProp<ViewStyle>
}

export const FakeCallWaiting = ({ delay, onCancel, pulseStyle }: FakeCallWaitingProps) => {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.avatar, pulseStyle]}>
        <Ionicons color={colors.phoneGreen} name="call" size={46} />
      </Animated.View>
      <Text style={styles.title}>CALL SCHEDULED</Text>
      <Text style={styles.subtitle}>Incoming call in {delay / 1_000}s</Text>
      <Pressable accessibilityRole="button" onPress={onCancel} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>CANCEL</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.phoneGreen,
    borderRadius: 60,
    borderWidth: 2,
    height: 120,
    justifyContent: 'center',
    marginBottom: 28,
    width: 120,
  },
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  secondaryButton: {
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.offWhite,
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  subtitle: { color: colors.gray, fontFamily: 'Inter_400Regular', fontSize: 16, marginBottom: 28 },
  title: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    letterSpacing: 2,
    marginBottom: 28,
  },
})
