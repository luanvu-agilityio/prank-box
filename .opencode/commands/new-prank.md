---
description: Scaffolds a new prank screen with proper structure and registers it in the catalog.
agent: build
model: opencode-go/gpt-5.6-luna
---

I need to add a new prank to PrankBox. The prank is: $ARGUMENTS

Follow the "add-prank" skill instructions exactly:

1. Add a new entry to `features/prank-catalog/data/pranks.ts` with the appropriate id, name, description, icon, isFree, and color.
2. Create the feature folder `features/<prank-name>/screens/<PrankName>Screen.tsx` using the standard prank screen pattern from AGENTS.md (named export, arrow function).
3. Create the thin route wrapper `app/prank/<prank-id>.tsx` that imports and re-exports the screen as default.
4. The prank should be self-contained, with cleanup in useEffect return.
5. Include "For entertainment purposes only" text visibly on screen.
6. Use the correct Reanimated v3 APIs, expo-haptics, and expo-av where appropriate.
7. After creating, run `npx tsc --noEmit` to verify.
8. Report which files were created/modified.