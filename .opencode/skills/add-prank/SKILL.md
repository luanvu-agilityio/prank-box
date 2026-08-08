---
name: add-prank
description: Use when creating or scaffolding a new prank screen for PrankBox. Triggers on "new prank", "add prank", "create prank", "scaffold prank".
---

# Add Prank Skill

This skill guides the process of adding a new prank screen to PrankBox.

## Prerequisites

1. Read AGENTS.md for project conventions.
2. Check `constants/pranks.ts` to see existing prank entries (don't duplicate IDs).

## Steps

### Step 1: Register the prank in constants

Edit `constants/pranks.ts` and add a new entry:

```typescript
export interface PrankConfig {
  id: string
  name: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  isFree: boolean
  color: string
}

export const PRANKS: PrankConfig[] = [
  // ... existing pranks
  {
    id: 'prank-id',          // kebab-case, unique
    name: 'Prank Name',
    description: 'Short description shown on the card',
    icon: 'flash',           // Ionicons icon name
    isFree: true,           // false = requires IAP
    color: '#FF3B30',       // accent color for the card
  },
]
```

### Step 2: Create the screen file

Create `app/prank/<prank-id>.tsx` with this pattern:

```typescript
import { useState, useEffect } from 'react'
import { View, Pressable, StyleSheet, Text, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated'

export default function PrankIdScreen() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    return () => {
      // cleanup: stop animations, unload sounds, stop haptics
    }
  }, [])

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    // prank-specific logic here
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.touchArea} onPress={handlePress}>
        {/* prank-specific UI */}
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  touchArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
```

### Step 3: Add sound asset (if needed)

1. Place `.mp3` file in `assets/sounds/<prank-id>.mp3`
2. Import and use with expo-av:

```typescript
import { Audio } from 'expo-av'

const [sound, setSound] = useState<Audio.Sound | null>(null)

useEffect(() => {
  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/<prank-id>.mp3')
    )
    setSound(sound)
  }
  loadSound()
  return () => {
    sound?.unloadAsync()
  }
}, [])
```

### Step 4: Verify

1. Check the prank appears on the home grid (it reads from `constants/pranks.ts`).
2. Tap the card navigates to `/prank/<prank-id>`.
3. Run `npx tsc --noEmit` — zero errors.
4. Ensure cleanup works (stop animations, unload sounds when navigating away).

## Rules

- Each prank is fully self-contained in one file — no shared prank logic.
- Every prank screen must clean up resources in `useEffect` return.
- Include "For entertainment purposes only" text somewhere visible.
- Keep each prank screen under 300 lines. If it grows larger, extract shared UI to `components/`.