---
description: Runs TypeScript type check and lint to verify code quality.
agent: build
model: opencode-go/gpt-5.6-luna
---

Run a full type check and lint on the PrankBox project:

1. Run `npx tsc --noEmit` and report any errors.
2. If ESLint is configured, run `npx expo lint` or `npx eslint . --ext .ts,.tsx`.
3. If there are errors, fix them following the conventions in AGENTS.md.
4. Report a summary: number of errors before and after fixing.
5. If any error is unclear or requires a design decision, ask the user.