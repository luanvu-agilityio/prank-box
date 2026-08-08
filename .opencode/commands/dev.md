---
description: Runs the PrankBox app in development mode on a device or emulator.
agent: build
model: opencode-go/gpt-5.6-luna
---

Start the PrankBox development server:

1. Check if dependencies are installed: look for `node_modules/`. If missing, run `npm install`.
2. If the project isn't initialized yet (no `package.json`), tell the user to run the init command first.
3. Run `npx expo start` to start the dev server.
4. Provide QR code instructions for the user to scan with Expo Go on their phone.
5. If the user wants to run on Android emulator, run `npx expo start --android`.
6. Report the dev server URL and any warnings.