import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

interface FakeCallConnectedProps {
  callerName: string
  elapsedSeconds: number
  isMuted: boolean
  isSpeakerOn: boolean
  onEndCall: () => void
  onToggleMute: () => void
  onToggleSpeaker: () => void
}

export function FakeCallConnected({
  callerName,
  elapsedSeconds,
  isMuted,
  isSpeakerOn,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
}: FakeCallConnectedProps) {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0')

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, styles.connectedAvatar]}>
        <Ionicons color={colors.phoneGreen} name="call" size={40} />
      </View>
      <Text style={styles.callerName}>{callerName || 'Unknown Caller'}</Text>
      <Text style={styles.connectedText}>SIMULATED CALL CONNECTED</Text>
      <Text style={styles.timer}>
        {minutes}:{seconds}
      </Text>
      <View style={styles.connectedActions}>
        <Pressable
          accessibilityLabel={isMuted ? 'Unmute simulated call' : 'Mute simulated call'}
          accessibilityRole="button"
          accessibilityState={{ selected: isMuted }}
          onPress={onToggleMute}
          style={styles.connectedAction}
        >
          <Ionicons
            color={isMuted ? colors.phoneGreen : colors.white}
            name={isMuted ? 'mic-off' : 'mic'}
            size={24}
          />
          <Text style={styles.actionLabel}>Mute</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={isSpeakerOn ? 'Turn speaker off' : 'Turn speaker on'}
          accessibilityRole="button"
          accessibilityState={{ selected: isSpeakerOn }}
          onPress={onToggleSpeaker}
          style={styles.connectedAction}
        >
          <Ionicons
            color={isSpeakerOn ? colors.phoneGreen : colors.white}
            name="volume-high"
            size={24}
          />
          <Text style={styles.actionLabel}>Speaker</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityLabel="End simulated call"
        accessibilityRole="button"
        onPress={onEndCall}
        style={[styles.circleButton, styles.declineButton]}
      >
        <Ionicons color={colors.white} name="call" size={28} />
      </Pressable>
      <Text style={styles.actionLabel}>End Call</Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
  callerName: { color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 30, marginBottom: 8 },
  circleButton: {
    alignItems: 'center',
    borderRadius: 38,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  connectedAction: { alignItems: 'center' },
  connectedActions: { flexDirection: 'row', gap: 42, marginBottom: 46, marginTop: 58 },
  connectedAvatar: { height: 96, marginBottom: 24, width: 96 },
  connectedText: {
    color: colors.phoneGreen,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    marginTop: 12,
  },
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  declineButton: { backgroundColor: colors.bloodRed },
  timer: { color: colors.white, fontFamily: 'SpaceMono_400Regular', fontSize: 24, marginTop: 8 },
})
