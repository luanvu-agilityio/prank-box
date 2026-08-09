import type { Config } from 'tailwindcss'
import { colors } from './shared/constants/colors'

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
    './shared/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: colors.ink,
        surface: colors.surface,
        card: colors.card,
        'card-pressed': colors.cardPressed,
        white: colors.white,
        'off-white': colors.offWhite,
        gray: colors.gray,
        border: colors.border,
        success: colors.success,
        warning: colors.warning,
        gold: colors.gold,
        error: colors.error,
        'electric-yellow': colors.electricYellow,
        'ice-blue': colors.iceBlue,
        'phone-green': colors.phoneGreen,
        'clipper-orange': colors.clipperOrange,
        'ghost-purple': colors.ghostPurple,
        'blood-red': colors.bloodRed,
        'system-gray': colors.systemGray,
        'roast-flame': colors.roastFlame,
        'storage-blue': colors.storageBlue,
        'bug-green': colors.bugGreen,
        'mind-cyan': colors.mindCyan,
      },
      fontSize: { micro: '11px', caption: '13px', body: '16px', h1: '32px', h2: '24px' },
      spacing: { arc: '150px', card: '164px', icon: '62px', header: '46px' },
      borderRadius: { control: '14px' },
      letterSpacing: { electric: '2px' },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-bold': ['Inter_700Bold'],
        mono: ['SpaceMono_700Bold'],
      },
    },
  },
  plugins: [],
}

export default config
