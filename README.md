# PrankBox

All-in-one prank app built with React Native + Expo. 7 pranks in one download.

## Tech Stack

- React Native via Expo (managed workflow, SDK 57)
- TypeScript (strict mode)
- Expo Router (file-based navigation)
- Zustand (state management)
- Reanimated v3 (animations)
- NativeWind + Tailwind CSS (styling)
- expo-haptics, expo-av
- @expo/vector-icons (Ionicons)"

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

## Project Structure

See AGENTS.md for full conventions and guidelines.

## Adding a New Prank

Run `/new-prank <prank name>` in OpenCode, or manually:

1. Create `app/prank/<prank-id>.tsx` — thin route wrapper
2. Create screen in `features/<prank-name>/screens/`
3. Add entry to `features/prank-catalog/data/pranks.ts`
4. Add sound asset to `assets/sounds/` if needed

## Build & Deploy

Use the `deploy-ios` skill or run:

```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

## Disclaimer

This app is for entertainment purposes only. All features are simulated pranks.