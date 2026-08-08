import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '@/shared/constants/colors'

interface FakeCallIncomingProps {
  callerName: string
  callerNumber: string
  onAccept: () => void
  onDecline: () => void
  pulseStyle: StyleProp<ViewStyle>
}

export function FakeCallIncoming({
  callerName,
  callerNumber,
  onAccept,
  onDecline,
  pulseStyle,
}: FakeCallIncomingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.incomingLabel}>INCOMING CALL...</Text>
      <Animated.View style={[styles.avatar, pulseStyle]}>
        <Text style={styles.avatarText}>{callerName.slice(0, 1).toUpperCase()}</Text>
      </Animated.View>
      <Text style={styles.callerName}>{callerName || 'Unknown Caller'}</Text>
      <Text style={styles.callerNumber}>{callerNumber || 'Unknown number'}</Text>
      <View style={styles.callActions}>
        <View style={styles.callAction}>
          <Pressable
            accessibilityRole="button"
            onPress={onDecline}
            style={[styles.circleButton, styles.declineButton]}
          >
            <Ionicons color={colors.white} name="close" size={30} />
          </Pressable>
          <Text style={styles.actionLabel}>Decline</Text>
        </View>
        <View style={styles.callAction}>
          <Pressable
            accessibilityRole="button"
            onPress={onAccept}
            style={[styles.circleButton, styles.acceptButton]}
          >
            <Ionicons color={colors.white} name="call" size={28} />
          </Pressable>
          <Text style={styles.actionLabel}>Accept</Text>
        </View>
      </View>
      <Text style={styles.swipeHint}>swipe to answer</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  acceptButton: { backgroundColor: colors.phoneGreen },
  actionLabel: {
    color: colors.offWhite,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 8,
  },
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
  avatarText: { color: colors.phoneGreen, fontFamily: 'Inter_700Bold', fontSize: 48 },
  callAction: { alignItems: 'center', gap: 10 },
  callActions: { flexDirection: 'row', gap: 58, marginTop: 70 },
  callerName: { color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 30, marginBottom: 8 },
  callerNumber: { color: colors.gray, fontFamily: 'Inter_400Regular', fontSize: 16 },
  circleButton: {
    alignItems: 'center',
    borderRadius: 38,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  declineButton: { backgroundColor: colors.bloodRed },
  incomingLabel: {
    color: colors.phoneGreen,
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 24,
  },
  swipeHint: { color: colors.gray, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 42 },
})
