import { Ionicons } from '@expo/vector-icons'
import { Switch, Text, View } from 'react-native'
import { colors } from '@/shared/constants/colors'

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
}

export const SettingRow = ({ icon, label, value, onValueChange }: SettingRowProps) => (
  <View className="min-h-header flex-row items-center justify-between">
    <View className="flex-row items-center gap-4">
      <Ionicons color={colors.gray} name={icon} size={20} />
      <Text className="font-inter-bold text-base text-white">{label}</Text>
    </View>
    <Switch
      ios_backgroundColor={colors.border}
      onValueChange={onValueChange}
      thumbColor={colors.white}
      trackColor={{ false: colors.border, true: colors.success }}
      value={value}
    />
  </View>
)
