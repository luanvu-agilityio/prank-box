export const GHOST_TYPES = [
  'POLTERGEIST',
  'SHADOW FIGURE',
  'WRAITH',
  'SPIRIT',
  'PHANTOM',
  'REVENANT',
  'SPECTER',
  'ENTITY',
  'APPARITION',
] as const

export const GHOST_LEVELS = ['CALM', 'MODERATE', 'HIGH', 'EXTREME'] as const

export const GHOST_CONFIG = {
  maxEmf: 10,
  radarSize: 280,
  sweepDuration: 3_000,
} as const
