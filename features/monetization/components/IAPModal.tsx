import * as Haptics from 'expo-haptics'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

interface IAPModalProps {
  error: string | null
  isLoading: boolean
  onClose: () => void
  onPurchase: () => void
  onRestore: () => void
  visible: boolean
}

export const IAPModal = ({
  error,
  isLoading,
  onClose,
  onPurchase,
  onRestore,
  visible,
}: IAPModalProps) => {
  const handleClose = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onClose()
  }

  const handlePurchase = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPurchase()
  }

  const handleRestore = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onRestore()
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>PRANKBOX PREMIUM</Text>
          <Text style={styles.title}>Unlock All Pranks</Text>
          <Text style={styles.body}>
            Get instant access to all 7 pranks and remove all ads forever.
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>✂️ Hair Clipper</Text>
            <Text style={styles.feature}>👻 Ghost Detector</Text>
            <Text style={styles.feature}>💀 Scary Popup</Text>
            <Text style={styles.feature}>⬇️ Fake Update</Text>
          </View>
          <Text style={styles.terms}>One-time payment. No subscription or recurring charges.</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={handlePurchase}
            style={({ pressed }) => [styles.purchaseButton, pressed && styles.pressed]}
          >
            <Text style={styles.purchaseText}>
              {isLoading ? 'Processing...' : 'Unlock Now — $1.99'}
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={isLoading} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore previous purchase</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={isLoading} onPress={handleClose}>
            <Text style={styles.closeText}>Maybe Later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: `${colors.ink}CC`,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  body: {
    color: colors.offWhite,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: `${colors.gold}55`,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    width: '100%',
  },
  closeText: { color: colors.gray, fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 18 },
  error: {
    color: colors.error,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  eyebrow: {
    color: colors.gold,
    fontFamily: 'SpaceMono_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  feature: { color: colors.white, fontFamily: 'Inter_500Medium', fontSize: 15, lineHeight: 26 },
  featureList: { alignSelf: 'stretch', marginVertical: 18 },
  pressed: { opacity: 0.8 },
  purchaseButton: {
    alignItems: 'center',
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
  },
  purchaseText: { color: colors.ink, fontFamily: 'Inter_700Bold', fontSize: 15 },
  restoreText: {
    color: colors.gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  terms: {
    color: colors.gray,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 18,
    textAlign: 'center',
  },
  title: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    marginBottom: 8,
    textAlign: 'center',
  },
})
