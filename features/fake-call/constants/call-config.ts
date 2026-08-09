import type { DelayOption } from '@/features/fake-call/types/call-types'

export const DELAY_OPTIONS: DelayOption[] = [
  { label: '5s', value: 5_000 },
  { label: '10s', value: 10_000 },
  { label: '30s', value: 30_000 },
  { label: '1min', value: 60_000 },
]
