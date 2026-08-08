import { Pressable, Text } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const actionButtonVariants = cva('items-center justify-center rounded-control px-5 py-4', {
  variants: { tone: { light: 'bg-white', accent: 'bg-gold', ghost: 'bg-white/10' } },
  defaultVariants: { tone: 'light' },
})

interface ActionButtonProps extends VariantProps<typeof actionButtonVariants> {
  label: string
  onPress: () => void
  className?: string
}

export const ActionButton = ({ label, onPress, tone, className }: ActionButtonProps) => (
  <Pressable
    accessibilityRole="button"
    className={cn(actionButtonVariants({ tone }), className)}
    onPress={onPress}
  >
    <Text
      className={
        tone === 'ghost'
          ? 'font-inter-bold text-base text-white'
          : 'font-inter-bold text-base text-ink'
      }
    >
      {label}
    </Text>
  </Pressable>
)
