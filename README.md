# PrankBox

All-in-one prank app built with React Native + Expo. 7+ pranks in one download.

## Tech Stack

- React Native via Expo (managed workflow)
- TypeScript (strict mode)
- Expo Router (file-based navigation)
- Zustand (state management)
- Reanimated v3 (animations)
- expo-haptics, expo-av

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

1. Create `app/prank/<prank-id>.tsx`
2. Add entry to `constants/pranks.ts`
3. Add sound asset to `assets/sounds/` if needed

## Build & Deploy

Use the `deploy-ios` skill or run:

```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

## Disclaimer

This app is for entertainment purposes only. All features are simulated pranks.