import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Modal, Pressable, Text, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

interface DisclaimerModalProps {
  visible: boolean
  onClose: () => void
}

export const DisclaimerModal = ({ visible, onClose }: DisclaimerModalProps) => {
  const handleClose = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onClose()
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 items-center justify-center bg-black/80 p-6">
        <View className="w-full items-center rounded-3xl border border-border bg-surface p-8">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-warning/15">
            <Ionicons color={colors.warning} name="warning" size={24} />
          </View>
          <Text className="mb-2 text-center font-inter-bold text-2xl text-white">
            For entertainment only
          </Text>
          <Text className="text-center font-inter text-base leading-6 text-off-white">
            All features are simulated pranks. No real shocks, ghosts, calls, or system changes
            occur. Prank responsibly and never target vulnerable people.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleClose}
            className="mt-6 w-full items-center rounded-xl bg-white py-4"
          >
            <Text className="font-inter-bold text-base text-ink">I understand</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
