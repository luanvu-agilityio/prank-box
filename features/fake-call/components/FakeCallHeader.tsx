import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

interface FakeCallHeaderProps {
  onBack: () => void
  onShowDisclaimer: () => void
}

export const FakeCallHeader = ({ onBack, onShowDisclaimer }: FakeCallHeaderProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.iconButton}
      >
        <Ionicons color={colors.phoneGreen} name="chevron-back" size={24} />
      </Pressable>
      <Pressable
        accessibilityLabel="Show disclaimer"
        accessibilityRole="button"
        onPress={onShowDisclaimer}
        style={styles.iconButton}
      >
        <Ionicons color={colors.gray} name="warning-outline" size={20} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
})
