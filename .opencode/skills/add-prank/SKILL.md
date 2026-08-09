---
name: add-prank
description: Use when creating or scaffolding a new prank screen for PrankBox. Triggers on "new prank", "add prank", "create prank", "scaffold prank".
---

# Add Prank Skill

This skill guides the process of adding a new prank screen to PrankBox.

## Prerequisites

1. Read AGENTS.md for project conventions.
2. Check `features/prank-catalog/data/pranks.ts` to see existing prank entries (don't duplicate IDs).

## Steps

### Step 1: Register the prank in the catalog

Edit `features/prank-catalog/data/pranks.ts` and add a new entry:

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

### Step 2: Create the feature folder and screen

Create `features/<prank-name>/screens/<PrankName>Screen.tsx` with this pattern:

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

export const PrankNameScreen = () => {
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

### Step 3: Create the thin route wrapper

Create `app/prank/<prank-id>.tsx`:

```typescript
import { PrankNameScreen } from '@/features/<prank-name>/screens/PrankNameScreen'

export default PrankNameScreen
```

### Step 4: Add sound asset (if needed)

1. Place `.mp3` file in `assets/sounds/<prank-id>.mp3`
2. Import and use with expo-av in the screen file:

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

### Step 5: Verify

1. Check the prank appears on the home grid (it reads from `features/prank-catalog/data/pranks.ts`).
2. Tap the card navigates to `/prank/<prank-id>`.
3. Run `npx tsc --noEmit` — zero errors.
4. Ensure cleanup works (stop animations, unload sounds when navigating away).

## Rules

- Each prank is self-contained in its own feature folder under `features/<prank-name>/`.
- Route files (`app/prank/*.tsx`) must be thin 3-line wrappers.
- Every prank screen must clean up resources in `useEffect` return.
- Include "For entertainment purposes only" text somewhere visible.
- Keep each prank screen under 300 lines. If it grows larger, extract sub-components to `features/<prank-name>/components/`.