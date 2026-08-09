import type { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { colors } from '@/shared/constants/colors'

export type PrankIconName = ComponentProps<typeof Ionicons>['name']

export interface PrankConfig {
  id: string
  name: string
  description: string
  icon: PrankIconName
  color: string
  accentClass: string
  isFree: boolean
  route: `/prank/${string}`
}

export const pranks: PrankConfig[] = [
  {
    id: 'shock',
    name: 'Shock Phone',
    description: 'Tap to shock',
    icon: 'flash',
    color: colors.electricYellow,
    accentClass: 'border-gold',
    isFree: true,
    route: '/prank/shock',
  },
  {
    id: 'crack',
    name: 'Crack Screen',
    description: 'Tap to crack',
    icon: 'phone-portrait',
    color: colors.iceBlue,
    accentClass: 'border-sky-400',
    isFree: true,
    route: '/prank/crack',
  },
  {
    id: 'fakecall',
    name: 'Fake Call',
    description: 'Schedule a call',
    icon: 'call',
    color: colors.phoneGreen,
    accentClass: 'border-success',
    isFree: true,
    route: '/prank/fakecall',
  },
  {
    id: 'clipper',
    name: 'Hair Clipper',
    description: 'Tap to buzz',
    icon: 'cut',
    color: colors.clipperOrange,
    accentClass: 'border-orange-400',
    isFree: false,
    route: '/prank/clipper',
  },
  {
    id: 'ghost',
    name: 'Ghost Detector',
    description: 'Find spirits',
    icon: 'eye',
    color: colors.ghostPurple,
    accentClass: 'border-purple-500',
    isFree: false,
    route: '/prank/ghost',
  },
  {
    id: 'scream',
    name: 'Scary Popup',
    description: 'Surprise friends',
    icon: 'skull',
    color: colors.bloodRed,
    accentClass: 'border-red-600',
    isFree: false,
    route: '/prank/scream',
  },
  {
    id: 'fakeupdate',
    name: 'Fake Update',
    description: 'Fake iOS update',
    icon: 'download',
    color: colors.systemGray,
    accentClass: 'border-slate-500',
    isFree: false,
    route: '/prank/fakeupdate',
  },
  {
    id: 'roast',
    name: 'Roast Booth',
    description: 'AI face roast',
    icon: 'flame',
    color: colors.roastFlame,
    accentClass: 'border-orange-500',
    isFree: true,
    route: '/prank/roast',
  },
  {
    id: 'storage',
    name: 'Storage Full',
    description: 'Fake storage panic',
    icon: 'cloud',
    color: colors.storageBlue,
    accentClass: 'border-blue-500',
    isFree: true,
    route: '/prank/storage',
  },
  {
    id: 'bug',
    name: 'Bug on Screen',
    description: 'Chase the bug',
    icon: 'bug',
    color: colors.bugGreen,
    accentClass: 'border-lime-500',
    isFree: false,
    route: '/prank/bug',
  },
  {
    id: 'mindreader',
    name: 'Mind Reader',
    description: 'AI thought scanner',
    icon: 'pulse',
    color: colors.mindCyan,
    accentClass: 'border-cyan-500',
    isFree: false,
    route: '/prank/mindreader',
  },
]
