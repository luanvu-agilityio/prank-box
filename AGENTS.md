# PrankBox — Agent Instructions

## Project Overview

**PrankBox** is a React Native (Expo) app for iOS and Android — an all-in-one prank hub bundling 7+ mini prank apps (electric shock, crack screen, fake call, hair clipper, ghost detector, scary scream, fake update).

**Goal:** Lightweight, offline-only, easy to maintain by one developer. Monetized with banner/interstitial ads + $1.99 IAP to unlock all pranks and remove ads.

## Reference Documents (Read Before Building)

| Document | Read When |
|---|---|
| `docs/design-system.md` | Creating any UI component, setting colors/fonts/spacing |
| `docs/prank-specs.md` | Building or modifying any prank screen |
| `docs/content-copy.md` | Adding any text, button labels, onboarding, disclaimers |
| `docs/asset-list.md` | Needing sounds, images, icons, fonts, or app icon |
| `docs/build-plan.md` | Starting a new build phase or wondering what to do next |
| `docs/ad-monetization.md` | Implementing ads, IAP, or pricing |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native via Expo (managed workflow) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Animations | react-native-reanimated v3 |
| Haptics | expo-haptics |
| Audio | expo-av |
| Storage | @react-native-async-storage/async-storage |
| Ads | react-native-google-mobile-ads |
| IAP | expo-in-app-purchases (or react-native-iap) |
| Icons | @expo/vector-icons (Ionicons) |

## Project Structure

```
PrankBox/
├── app/                        # Expo Router screens (file = route)
│   ├── (tabs)/
│   │   ├── index.tsx           # Home: prank grid
│   │   └── settings.tsx        # Settings
│   ├── prank/
│   │   ├── shock.tsx           # Each prank = 1 file
│   │   ├── crack.tsx
│   │   ├── fakecall.tsx
│   │   ├── clipper.tsx
│   │   ├── ghost.tsx
│   │   ├── scream.tsx
│   │   └── fakeupdate.tsx
│   └── _layout.tsx             # Root layout (ad provider, onboarding)
├── components/                 # Shared UI components
├── stores/                     # Zustand stores
├── constants/                  # Static config data
├── assets/                     # Sounds, images, fonts
└── opencode.json               # AI agent config
```

## Coding Conventions

### General Rules

1. **TypeScript strict mode** — always. No `any` unless absolutely necessary (add `// eslint-disable-next-line` with reason).
2. **ES6+ syntax** — use arrow functions, const/let (never var), template literals, destructuring, spread operators, optional chaining, nullish coalescing.
3. **No comments** — unless the user explicitly asks. Code should be self-documenting through clear naming.
4. **Functional components only** — no class components. Use React hooks.
5. **Named exports** — prefer `export function ComponentName()` over default exports. Exception: Expo Router screen files must use default exports (router requirement).
6. **File naming** — `kebab-case` for files (e.g., `prank-card.tsx`), `PascalCase` for components/types/interfaces (e.g., `PrankCard`, `PrankConfig`).
7. **Constants** — `UPPER_SNAKE_CASE` for true constants, `camelCase` for configuration objects.
8. **No inline styles** — use `StyleSheet.create()` at the bottom of each component file.
9. **One component per file** — except for tiny sub-components tightly coupled to the parent.

### React Native Specific

1. **Use Reanimated v3** for all animations — `useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`, `withRepeat`. Never use the legacy Animated API.
2. **Use `Pressable`** instead of `TouchableOpacity` (better feedback control).
3. **Use `SafeAreaView`** from `react-native-safe-area-context` — never the built-in `SafeAreaView`.
4. **Platform-specific code** — use `Platform.select()` or `Platform.OS` checks. Don't use `Platform.select` for trivial cases.
5. **Haptics** — always pair visual feedback with haptic feedback using `expo-haptics`. Use `Haptics.impactAsync()` for taps, `Haptics.notificationAsync()` for results.

### State Management (Zustand)

1. **One store per concern** — don't put everything in one giant store.
2. **Use `create` with TypeScript generics**:
   ```typescript
   interface PrankStore {
     unlockedPranks: string[]
     isPremium: boolean
     unlockPrank: (id: string) => void
     setPremium: (value: boolean) => void
   }
   const usePrankStore = create<PrankStore>((set) => ({
     unlockedPranks: [],
     isPremium: false,
     unlockPrank: (id) => set((state) => ({
       unlockedPranks: [...state.unlockedPranks, id]
     })),
     setPremium: (value) => set({ isPremium: value }),
   }))
   ```
3. **Persist with middleware** — use `zustand/middleware` `persist` for data that should survive app restarts.
4. **Select only what you need** — `usePrankStore((state) => state.isPremium)` to prevent unnecessary re-renders.

### Adding a New Prank (The 3-Step Rule)

1. Create `app/prank/<prank-name>.tsx` — self-contained screen
2. Add entry to `constants/pranks.ts` — id, name, description, icon, isFree
3. Add sound asset to `assets/sounds/` if needed

The prank auto-appears on the home grid. No other wiring needed.

### Prank Screen Pattern

Every prank screen should follow this structure:

```typescript
import { useState, useEffect } from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated'

export default function PrankNameScreen() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)

  // ... prank-specific logic

  return (
    <View style={styles.container}>
      {/* prank UI */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
})
```

## Lint & Type Check Commands

Run these before considering any task complete:

```bash
npx tsc --noEmit          # Type check
npx expo lint             # ESLint (if configured)
```

If these commands don't exist yet (project not initialized), skip and note it.

## App Store Compliance Rules

1. Every prank must include "For entertainment purposes only" disclaimer.
2. Onboarding screen must show disclaimer and require user to tap "I understand".
3. Settings page must have a visible "About / Legal" section with full disclaimer.
4. No prank may impersonate the iOS/Android system UI without a visible "PRANK" indicator.
5. No prank may collect, transmit, or store personal data.

## Workflow

1. **Planning** — Use the `plan` agent for architecture decisions, feature design, and task breakdown.
2. **Building** — Use the `build` agent (default) for coding tasks.
3. **Bug fixing** — Use the `bugfix` agent for debugging.
4. **Reviewing** — Run `/review` command or use the `code-review` skill before committing.
5. **Adding pranks** — Run `/new-prank <name>` command or use the `add-prank` skill.
6. **Deploying** — Use the `deploy-ios` skill for EAS Build and App Store submission steps.

## Go Plan Budget & 5-Hour Window Strategy

### How the $10/Month Plan Works

The $10/month gives **$60 of usage value** (6x multiplier). You do NOT have $10 of usage — you have $60.

| Limit | Budget | Resets |
|---|---|---|
| 5-hour window | $12 of usage | Every 5 hours (rolling) |
| Weekly | $30 of usage | Every 7 days |
| Monthly | $60 of usage | Every billing month |

All three limits apply simultaneously. The most restrictive one wins.

### Reading Your Usage in the TUI

When opencode shows usage, it displays:
- **Tokens used** — total tokens consumed in current session
- **Context %** — percentage of the **context window** used (NOT your budget)
- **Money spent** — deducted from the $60 monthly budget (NOT from the $10 payment)

Example: If you see "$2.63 spent", you have $60 - $2.63 = **~$57.37 of usage remaining** for the month, not $7.

### 5-Hour Window Optimization Plan

The $12/5hr window is the most frequent constraint. Optimize for it:

| Window Phase | Strategy | Model to Use |
|---|---|---|
| **Fresh window** (0-20% used, ~$0-2.40 spent) | Heavy coding, complex tasks | GPT 5.6 Luna or GLM-5.2 |
| **Mid window** (20-60% used, ~$2.40-7.20 spent) | Normal coding, but avoid expensive models | GPT 5.6 Luna only |
| **Late window** (60-85% used, ~$7.20-10.20 spent) | Simple tasks only | DeepSeek V4 Flash or free models |
| **Nearly depleted** (85%+ used, ~$10.20+ spent) | Stop or use free models only | Free models only |
| **Window resets** | Full $12 available | Start heavy work again |

### Model Cost Per 5-Hour Window (Go Plan)

Sorted by value (most requests per $12 window):

| Model | Output per 1M | Requests per $12 window | When to Use |
|---|---|---|---|
| DeepSeek V4 Flash | $0.28 | ~63,300 (Go limit) | Almost unlimited — main workhorse |
| MiMo-V2.5 | $0.28 | ~30,100 (Go limit) | Backup when Flash is low |
| GPT 5.6 Luna | $1.20 | ~2,050 | Primary coding model (best balance) |
| Qwen3.7 Plus | $1.60 | ~4,300 | Alternative coding |
| MiniMax M3 | $1.20 | ~3,200 | Alternative |
| Kimi K2.7 Code | $4.00 | ~1,350 | When you need strong code reasoning |
| GLM-5.2 | $4.40 | ~880 | Planning, architecture (expensive but rare use) |
| Grok 4.5 | $6.00 | ~120 | Avoid unless specifically needed |
| Kimi K3 | $15.00 | ~110 | Never use casually — very expensive |

### Daily Budget Allocation Plan

With $30/week = ~$4.28/day optimal spend:

| Task Type | Daily Budget | Model |
|---|---|---|
| Main coding session (1-2 hrs) | ~$2-3 | GPT 5.6 Luna |
| Planning brief | ~$0.50 | GLM-5.2 (1-2 requests) |
| Simple edits, titles, misc | ~$0 | Free models |
| Total | ~$2.50-3.50/day | Well within $4.28/day |

### Cost-Saving Rules for the Agent

1. **Always use free models for trivial tasks** — session titles, summaries, compaction are pre-configured for this.
2. **Prefer GPT 5.6 Luna for coding** — it's 3.7x cheaper than GLM-5.2 and 5x cheaper than Grok 4.5.
3. **Use GLM-5.2 only for planning** — it's expensive ($4.40/1M output). Max 1-2 planning requests per session.
4. **Never use Kimi K3** — $15/1M output is 12x more expensive than Luna. Only use if the user explicitly asks.
5. **Use free models (deepseek-v4-flash-free, mimo-v2.5-free) for:
   - Reading and understanding existing code
   - Simple refactors
   - Typo fixes
   - Generating session titles (auto-configured)
6. **If 5hr window is >70% used**, switch to free models or DeepSeek V4 Flash (cheapest Go model).
7. **Batch tasks** — plan your session before starting: know what you'll build, then do it in one focused burst instead of spreading across the day.

### Weekly Reset Planning

| Day | Budget | Best Use |
|---|---|---|
| Day 1-2 | Fresh weekly budget ($30) | Heavy feature development |
| Day 3-4 | ~$20 left | Continue coding, use cheaper models |
| Day 5-6 | ~$10 left | Light coding, bug fixes, free models |
| Day 7 | ~$5 left or waiting for reset | Free models only, or rest |

### Promotion Watch

Go plans sometimes run promotions (e.g., "2x usage limits for a limited time"). When active:
- DeepSeek V4 Flash at 2x = ~63,300 requests per 5 hours
- GPT 5.6 Luna at 2x = ~4,100 requests per 5 hours
- This effectively means unlimited for a solo developer
- Check the Go page at opencode.ai/go for current promotions

### Zen Pay-As-You-Go (for Emergencies Only)

Use Zen balance ($20 pay-as-you-go) ONLY when:
1. Go monthly limit ($60) is exhausted
2. You need Claude Sonnet 5 for a stubborn bug (Zen price: $2/$10 per 1M tokens)
3. You need GPT 5.5 or Opus for a critical decision

Zen is NOT needed for normal development. Go covers everything.

### Quick Budget Check

Run `/budget` in the TUI to see a summary of your current Go plan usage and remaining budget.

## Context & Token Management

### How Context Degradation Works

As a session grows, the agent's context window fills up. Symptoms of degradation:
- Agent forgets earlier instructions or conventions
- Agent repeats work or re-reads files unnecessarily
- Agent produces lower-quality output
- Responses become slower and more expensive

### Context Budget Rules

1. **Be concise** — Keep responses short. Don't explain what you did unless asked. Don't restate the user's question.
2. **Don't re-read files** — If you already read a file in this session, use that knowledge. Only re-read if the file was modified since you last read it.
3. **Use subagents for exploration** — Delegate codebase searches to the `explore` subagent via the Task tool. This keeps the main session's context clean.
4. **Batch file reads** — When you need to read multiple files, read them all in one tool call block, not one at a time.
5. **Don't dump file contents** — When referencing a file, cite `file:line` instead of pasting the full content.
6. **Use grep/glob first** — Search for patterns before reading entire files. Only read the relevant section.
7. **One task per session** — If the user asks for a new unrelated task, suggest starting a new session.

### Session Rotation Strategy

| Context State | What to Do |
|---|---|
| **Green** (0-40% used) | Normal work. Use default model. |
| **Yellow** (40-70% used) | Continue but be extra concise. Avoid re-reading files. Delegate searches to subagents. |
| **Orange** (70-85% used) | Wrap up current task. Don't start new sub-tasks. Suggest user start a new session for next task. |
| **Red** (85%+ / compaction triggered) | Stop. Tell the user: "Context is nearly full. Please start a new session for further work." Compaction will auto-trigger but quality drops. |

### When to Start a New Session

Start a new session when:
1. You finish a complete feature (e.g., one prank is done)
2. You switch from coding to debugging (different mental context)
3. You're about to start a new unrelated task
4. The user explicitly asks for a fresh start
5. You notice compaction has triggered (context was summarized)

### When to Switch Models

| Situation | Model to Switch To |
|---|---|
| Normal coding | `opencode-go/gpt-5.6-luna` (default, best value) |
| Architecture/planning | `opencode-go/glm-5.2` (strong reasoning) |
| Quick refactor or simple edit | `opencode/deepseek-v4-flash-free` (free, saves Go quota) |
| Stuck on a bug for 3+ attempts | `opencode/claude-sonnet-5` (Zen, strongest coding, use sparingly) |
| Context getting large | Switch to a model with larger context window or start new session |

### Configured Protections

The following are pre-configured in `opencode.json`:

| Protection | Setting | What It Does |
|---|---|---|
| Auto-compaction | `compaction.auto: true` | Summarizes old context when window fills |
| Pruning | `compaction.prune: true` | Removes old tool outputs (file contents, command outputs) to save tokens |
| Tail turns | `compaction.tail_turns: 8` | Keeps last 8 conversation turns verbatim during compaction |
| Preserve tokens | `compaction.preserve_recent_tokens: 12000` | Keeps 12K tokens of recent context intact |
| Reserved buffer | `compaction.reserved: 8000` | 8K token buffer prevents overflow during compaction |
| Tool output limit | `tool_output.max_lines: 150` | Truncates tool output to 150 lines (full output saved to disk) |
| Tool output bytes | `tool_output.max_bytes: 6144` | Truncates tool output to 6KB (full output saved to disk) |
| Build agent steps | `agent.build.steps: 30` | Max 30 iterations before forcing text-only response (prevents runaway loops) |
| Plan agent steps | `agent.plan.steps: 15` | Max 15 iterations for planning |
| Bugfix agent steps | `agent.bugfix.steps: 20` | Max 20 iterations for debugging |
| Compaction model | `agent.compaction.model: deepseek-v4-flash-free` | Uses free model for compaction summaries (saves money) |
| Title/summary model | `agent.title/summary.model: deepseek-v4-flash-free` | Uses free model for session titles (saves money) |
| Subagent depth | `subagent_depth: 1` | Subagents can't spawn subagents (prevents context explosion) |
| Image resize | `attachment.image.max_width: 1000` | Images resized to max 1000px (reduces token usage) |
| Watcher ignore | `watcher.ignore` | Ignores node_modules, .expo, dist, .git (reduces filesystem noise) |
