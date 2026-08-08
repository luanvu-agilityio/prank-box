---
name: code-review
description: Use when reviewing code before commit, or when the user says "review", "check code", "lint check". Reviews TypeScript/React Native code for convention violations and bugs.
---

# Code Review Skill

This skill provides a checklist for reviewing PrankBox code quality and convention compliance.

## Review Checklist

Run through every item before considering code ready.

### TypeScript

- [ ] No `any` types without explicit justification
- [ ] All props, state, and store interfaces are typed
- [ ] No unused imports or variables
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Strict mode compatible (no `@ts-ignore` without explanation)

### ES6+ Syntax

- [ ] `const` / `let` only — no `var`
- [ ] Arrow functions for callbacks
- [ ] Template literals instead of string concatenation
- [ ] Destructuring for props and state
- [ ] Optional chaining (`?.`) and nullish coalescing (`??`) where appropriate
- [ ] Spread operator for arrays/objects instead of manual copies

### React Native

- [ ] Functional components with hooks only — no class components
- [ ] `Pressable` instead of `TouchableOpacity`
- [ ] `SafeAreaView` from `react-native-safe-area-context`
- [ ] `StyleSheet.create()` — no inline `style={{}}` objects
- [ ] `react-native-reanimated` v3 APIs (not legacy `Animated`)
- [ ] `expo-haptics` paired with visual interactions
- [ ] Platform-specific code uses `Platform.select()` or `Platform.OS`

### Architecture

- [ ] Prank screens are self-contained in one file under `app/prank/`
- [ ] Shared UI components are in `components/`
- [ ] State is in Zustand stores under `stores/`
- [ ] Static config data is in `constants/`
- [ ] New prank follows the 3-step rule (screen file, constants entry, sound asset)
- [ ] No new dependencies added without justification

### Resource Management

- [ ] `useEffect` cleanup functions exist for: sound unloading, animation cancellation, timer clearing
- [ ] No memory leaks (event listeners removed, subscriptions cleared)
- [ ] No infinite re-render loops in Zustand selectors

### App Store Compliance

- [ ] "For entertainment purposes only" disclaimer is present
- [ ] No impersonation of system UI without "PRANK" indicator
- [ ] No personal data collection or transmission
- [ ] No claims that the app performs real functions it doesn't

### Code Style

- [ ] No comments unless explicitly requested by the user
- [ ] Named exports (except Expo Router screens which require default exports)
- [ ] `kebab-case` filenames, `PascalCase` component/type names
- [ ] One component per file

## How to Use

1. Read the file(s) being reviewed.
2. Go through each checklist item.
3. Report any violations with file path and line number.
4. Fix violations directly if instructed, or list them for the build agent.
5. Run `npx tsc --noEmit` as final verification.