---
description: Scaffolds a new prank screen with proper structure and registers it in constants.
agent: build
model: opencode-go/gpt-5.6-luna
---

I need to add a new prank to PrankBox. The prank is: $ARGUMENTS

Follow the "add-prank" skill instructions exactly:

1. Add a new entry to `constants/pranks.ts` with the appropriate id, name, description, icon, isFree, and color.
2. Create the screen file `app/prank/<prank-id>.tsx` using the standard prank screen pattern from AGENTS.md.
3. The prank should be self-contained, with cleanup in useEffect return.
4. Include "For entertainment purposes only" text visibly on screen.
5. Use the correct Reanimated v3 APIs,expo-haptics, and expo-av where appropriate.
6. After creating, run `npx tsc --noEmit` to verify.
7. Report which files were created/modified.