export const DECOY_PROMPTS = [
  'Find the hidden object in this image...',
  'Stare at the dot for 10 seconds...',
  'What do you see in this image?',
  'Concentrate on the number...',
] as const

export const SCREAM_CONFIG = {
  scareDuration: 2_000,
  maxDelay: 7_000,
  minDelay: 3_000,
} as const
