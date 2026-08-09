import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import type { DelayOption } from '@/features/fake-call/types/call-types'
import { colors } from '@/shared/constants/colors'

interface FakeCallSetupProps {
  callerName: string
  callerNumber: string
  delay: number
  delayOptions: DelayOption[]
  onCallerNameChange: (value: string) => void
  onCallerNumberChange: (value: string) => void
  onDelayChange: (value: number) => void
  onStart: () => void
}

export const FakeCallSetup = ({
  callerName,
  callerNumber,
  delay,
  delayOptions,
  onCallerNameChange,
  onCallerNumberChange,
  onDelayChange,
  onStart,
}: FakeCallSetupProps) => {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>SIMULATED CALL</Text>
      <Text style={styles.helper}>Caller details are display-only and never sent.</Text>
      <Text style={styles.label}>Caller Name</Text>
      <TextInput
        accessibilityLabel="Simulated caller name"
        onChangeText={onCallerNameChange}
        placeholder="Mom"
        placeholderTextColor={colors.gray}
        style={styles.input}
        value={callerName}
      />
      <Text style={styles.label}>Caller Number</Text>
      <TextInput
        accessibilityLabel="Simulated caller number"
        keyboardType="phone-pad"
        onChangeText={onCallerNumberChange}
        placeholder="+1 555-0000"
        placeholderTextColor={colors.gray}
        style={styles.input}
        value={callerNumber}
      />
      <Text style={styles.label}>Delay</Text>
      <View style={styles.delayRow}>
        {delayOptions.map((option) => (
          <Pressable
            accessibilityLabel={`Set call delay to ${option.label}`}
            accessibilityState={{ selected: delay === option.value }}
            accessibilityRole="button"
            key={option.value}
            onPress={() => {
              void Haptics.selectionAsync()
              onDelayChange(option.value)
            }}
            style={[styles.delayChip, delay === option.value && styles.delayChipSelected]}
          >
            <Text style={[styles.delayText, delay === option.value && styles.delayTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityLabel="Start simulated call"
        accessibilityRole="button"
        onPress={onStart}
        style={styles.startButton}
      >
        <Ionicons color={colors.ink} name="call" size={20} />
        <Text style={styles.startButtonText}>START FAKE CALL</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 42 },
  delayChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  delayChipSelected: { backgroundColor: colors.phoneGreen, borderColor: colors.phoneGreen },
  delayRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  delayText: { color: colors.offWhite, fontFamily: 'Inter_700Bold', fontSize: 13 },
  delayTextSelected: { color: colors.ink },
  helper: { color: colors.gray, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: -18 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: colors.offWhite,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 18,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: colors.phoneGreen,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 42,
    paddingVertical: 17,
  },
  startButtonText: {
    color: colors.ink,
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  title: {
    color: colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    letterSpacing: 2,
    marginBottom: 28,
  },
})
