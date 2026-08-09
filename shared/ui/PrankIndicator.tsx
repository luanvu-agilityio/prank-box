import { StyleSheet, Text, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

export const PrankIndicator = () => {
  return (
    <View accessibilityLabel="Prank simulation indicator" style={styles.container}>
      <Text style={styles.label}>PRANK</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 30,
  },
  label: { color: colors.ink, fontFamily: 'SpaceMono_700Bold', fontSize: 11 },
})
