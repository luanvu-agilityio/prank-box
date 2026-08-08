# Build Plan — Phased Implementation

## Session Strategy

Each phase = 1 OpenCode session. Start a new session between phases to keep context clean and align with 5-hour budget windows.

---

## Phase 0: Project Init (1 session, ~1 hour)

### Goal
Initialize Expo project, install dependencies, configure TypeScript.

### Steps
1. Initialize Expo project in D:\PrankBox
   ```bash
   npx create-expo-app@latest . --template blank-typescript
   ```
2. Install dependencies
   ```bash
   npx expo install expo-router expo-linking expo-constants expo-status-bar
   npx expo install react-native-safe-area-context react-native-screens
   npx expo install react-native-reanimated
   npx expo install expo-haptics
   npx expo install expo-av
   npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/space-mono
   npx expo install react-native-svg
   npx expo install @react-native-async-storage/async-storage
   npm install zustand
   ```
3. Configure `tsconfig.json` for strict mode
4. Configure `app.json` with app name, bundle ID, splash screen
5. Set up Expo Router file structure (move existing `app/` files)
6. Create `babel.config.js` with reanimated plugin
7. Test: `npx expo start` — verify blank app loads in Expo Go

### Verification
- App loads with no errors in Expo Go
- `npx tsc --noEmit` passes

### Budget Estimate
~$0.50 (mostly file creation, simple commands)

---

## Phase 1: Foundation & Shell (1 session, ~2 hours)

### Goal
Create app shell: navigation, home grid, settings page, shared components, Zustand store.

### Files to Create
```
app/
  _layout.tsx              — Root layout (fonts, SafeArea, header)
  (tabs)/
    index.tsx              — Home: prank grid
    settings.tsx           — Settings page
constants/
  pranks.ts                — Prank registry with all 7 entries
  theme.ts                 — Colors, typography, spacing from design-system.md
stores/
  useAppStore.ts           — Zustand: isPremium, hapticsEnabled, soundEnabled
  usePrankStore.ts         — Zustand: unlockedPranks, unlockAll
components/
  PrankCard.tsx            — Card component for grid
  PrankScreenWrapper.tsx   — Back button + disclaimer + safe area wrapper
  LockBadge.tsx            — FREE / lock badge
  DisclaimerModal.tsx      — Reusable disclaimer modal
```

### Steps
1. Create `constants/theme.ts` with all colors, font sizes, spacing from design-system.md
2. Create `constants/pranks.ts` with all 7 prank configs
3. Create Zustand stores (useAppStore, usePrankStore) with persist middleware
4. Create shared components (PrankCard, PrankScreenWrapper, LockBadge, DisclaimerModal)
5. Build home grid screen — 2-column grid, reads from constants/pranks.ts
6. Build settings screen — premium status, preferences, about, legal sections
7. Build root layout — load fonts, SafeAreaProvider, initial route
8. Test all navigation flows (home → settings → back)

### Verification
- Home grid shows all 7 prank cards
- Lock badges show correctly (3 free, 4 locked)
- Settings page renders all sections
- Back navigation works
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.50 (substantial coding, multiple files)

---

## Phase 2: Onboarding (1 session, ~1 hour)

### Goal
Create 3-screen onboarding flow shown on first launch.

### Files to Create
```
app/
  onboarding.tsx           — Full onboarding flow (3 steps in one screen)
components/
  OnboardingSlideshow.tsx  — Reusable multi-step onboarding component
```

### Steps
1. Create onboarding screen with 3 steps from content-copy.md:
   - Welcome → Disclaimer (required checkbox) → Quick guide
2. Store "hasSeenOnboarding" flag in Zustand (persisted)
3. In root layout: check flag → show onboarding or home
4. Disclaimer checkbox must be checked to proceed
5. "Enter PrankBox" button → set flag true, navigate to home

### Verification
- First launch shows onboarding
- Cannot proceed without checking disclaimer
- Second launch skips onboarding
- `npx tsc --noEmit` passes

### Budget Estimate
~$0.50

---

## Phase 3: Prank 1 — Electric Shock (1 session, ~1.5 hours)

### Goal
Build the first fully functional prank screen.

### Files to Create
```
app/prank/
  shock.tsx                 — Electric shock prank screen
assets/sounds/
  electric-buzz.mp3         — (downloaded from asset-list.md)
```

### Steps
1. Download `electric-buzz.mp3` from freesound.org → place in assets/sounds/
2. Create shock screen following prank-specs.md section 1
3. Implement idle pulse animation (lightning bolt)
4. Implement shock state (screen flash, haptics, sound loop, arc animation)
5. Implement tap to toggle (start/stop shock)
6. Verify cleanup on unmount (cancel animations, stop haptics, unload sound)
7. Test on device: tap to shock, tap to stop, back button

### Verification
- Idle animation pulses
- Tap triggers flash + buzz + vibrate
- Tap again stops everything
- Back button works, no lingering sound/vibration
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.00

---

## Phase 4: Prank 2 — Crack Screen (1 session, ~1 hour)

### Goal
Build crack screen prank with SVG crack generation.

### Files to Create
```
app/prank/
  crack.tsx                 — Crack screen prank
components/
  CrackRenderer.tsx         — SVG crack generation component
assets/sounds/
  glass-crack.mp3
```

### Steps
1. Download `glass-crack.mp3` → assets/sounds/
2. Create CrackRenderer component — generates random branching crack SVG paths from a point
3. Create crack screen — tap anywhere to add crack, shatter sound, flash, haptic
4. Cracks accumulate in state (array of crack path arrays)
5. Long press → reset button → clears cracks
6. Verify cleanup (no looping sounds)

### Verification
- Tap creates realistic crack at tap point
- Multiple taps create multiple cracks
- Long press shows reset
- Sound plays on each tap
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.00

---

## Phase 5: Prank 3 — Fake Call (1 session, ~2 hours)

### Goal
Build fake call with setup screen and incoming call simulation.

### Files to Create
```
app/prank/
  fakecall.tsx              — Setup + incoming call + connected screens
assets/sounds/
  phone-ring.mp3
```

### Steps
1. Download `phone-ring.mp3` → assets/sounds/
2. Create setup screen: name input, number input, delay chips, start button
3. Create incoming call screen: caller avatar, accept/decline buttons, ring + vibrate
4. Create connected call screen: timer counting up, mute/speaker/end buttons (visual only)
5. Implement delay timer (5s/10s/30s/1min)
6. Ring sound loops + vibration pattern during incoming
7. Accept → connected screen, Decline → back to setup
8. End call → back to setup

### Verification
- Setup accepts text input
- Delay actually delays the call
- Incoming call rings and vibrates
- Accept shows connected screen with timer
- End call returns to setup
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.50 (most complex prank)

---

## Phase 6: Prank 4 — Hair Clipper (1 session, ~1 hour)

### Goal
Build vibrating hair clipper prank.

### Files to Create
```
app/prank/
  clipper.tsx               — Hair clipper prank
assets/sounds/
  clipper-buzz.mp3
```

### Steps
1. Download `clipper-buzz.mp3` → assets/sounds/
2. Create clipper screen with tap-to-activate
3. Continuous vibration pattern (200ms on / 100ms off loop)
4. Sound loops while active
5. Icon trembles while active (random offset ±2px)
6. Intensity slider appears when active (controls haptic strength)
7. Tap to stop → stops everything

### Verification
- Tap starts buzzing + vibrating + trembling
- Slider controls intensity
- Tap stops
- Back button cleans up
- `npx tsc --noEmit` passes

### Budget Estimate
~$0.75

---

## Phase 7: Prank 5 — Ghost Detector (1 session, ~2 hours)

### Goal
Build ghost detector with animated radar.

### Files to Create
```
app/prank/
  ghost.tsx                 — Ghost detector prank
components/
  RadarView.tsx             — SVG radar circle with sweep + dots
  EMFMeter.tsx              — Animated EMF bar + readings
assets/sounds/
  ghost-ambient.mp3
  ghost-blip.mp3 (optional)
```

### Steps
1. Download `ghost-ambient.mp3` → assets/sounds/
2. Create RadarView component — rotating sweep line, fading ghost dots
3. Create EMFMeter component — fluctuating bar, random readings text
4. Ghost types, distances, levels cycle randomly (from content-copy.md)
5. Ambient sound plays on enter, stops on exit
6. When EMF hits high → "ENTITY CLOSE" flash + haptic warning
7. Everything auto-runs, no user interaction needed (ambient prank)

### Verification
- Radar sweep rotates continuously
- Ghost dots appear and fade randomly
- EMF bar fluctuates
- Text labels cycle
- Ambient sound plays
- Back button stops all
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.50 (most complex animations)

---

## Phase 8: Prank 6 — Scary Popup (1 session, ~1.5 hours)

### Goal
Build jump scare prank with decoy screen.

### Files to Create
```
app/prank/
  scream.tsx                — Scary popup prank
assets/
  images/scary-face.jpg    — Downloaded from pixabay
  sounds/scream.mp3
```

### Steps
1. Download `scary-face.jpg` (1080x1920) and `scream.mp3` → assets/
2. Create decoy screen (random: find object / stare at dot / what do you see)
3. After random delay (3-7s) → jump scare:
   - Full screen scary image
   - Scream sound at max
   - Notification Warning haptic
   - Screen shake
4. After 2s → return to calm + "GOTCHA!" text
5. Tap to restart with new random delay and new decoy
6. Cleanup: stop sound if user backs out during scare

### Verification
- Decoy screen shows varied text
- Jump scare triggers after delay
- Sound plays at full volume
- Screen shakes
- Auto returns to calm after 2s
- Tap restarts
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.00

---

## Phase 9: Prank 7 — Fake Update (1 session, ~1 hour)

### Goal
Build fake iOS update screen.

### Files to Create
```
app/prank/
  fakeupdate.tsx            — Fake update prank
```

### Steps
1. Create fake update screen: black bg, white Apple logo (Ionicons logo-apple)
2. "iOS 19.4 / Installing..." text
3. Progress bar 0→100% over 60 seconds
4. At 100% → "Update Complete" → "Restarting..."
5. Hidden exit: tap Apple logo 5x rapidly → exit
6. Small "PRANK" text bottom corner (30% opacity, App Store compliance)
7. No sound (purely visual)

### Verification
- Apple logo renders
- Progress bar animates over 60s
- 5 taps on logo exits
- "PRANK" indicator visible
- `npx tsc --noEmit` passes

### Budget Estimate
~$0.75

---

## Phase 10: Ads & IAP (1 session, ~2 hours)

### Goal
Integrate Google AdMob banner/interstitial ads and $1.99 IAP.

### Files to Create
```
components/
  BannerAd.tsx              — AdMob banner (hidden if premium)
  InterstitialAd.tsx       — Interstitial ad wrapper
  IAPModal.tsx              — Unlock all pranks modal
stores/
  useAdStore.ts             — Ad display state
  useIAPStore.ts            — Purchase state
```

### Steps
1. Set up Google AdMob account (free) — get ad unit IDs
2. Install `react-native-google-mobile-ads`
3. Create BannerAd component — shows at bottom of home screen (hidden if premium)
4. Show interstitial ad when:
   - User opens a prank for the 3rd time in a session
   - User tries to open a locked prank (before IAP prompt)
5. Install IAP library (expo-in-app-purchases or react-native-iap)
6. Set up IAP product: `com.yourname.prankbox.unlock` — $1.99
7. Create IAPModal — unlock all pranks, remove ads, restore purchase
8. Wire IAP to Zustand store: set isPremium=true, unlock all pranks
9. Gate locked pranks: if !isPremium && !prank.isFree → show IAP modal

### Verification
- Banner ad shows on home (if not premium)
- Banner hidden if premium
- Interstitial shows on locked prank tap
- IAP modal works → unlocks pranks
- Restore purchase works
- `npx tsc --noEmit` passes

### Budget Estimate
~$1.50 (ads + IAP integration is tricky)

---

## Phase 11: Polish & Testing (1 session, ~2 hours)

### Goal
Final polish, edge cases, App Store prep.

### Steps
1. Run full code review using `/review` command (code-review skill)
2. Fix all convention violations
3. Add App Store screenshot mockups if needed
4. Test all 7 pranks on device (or simulator)
5. Test onboarding skip on second launch
6. Test IAP flow (use sandbox tester account)
7. Verify all cleanup functions (no lingering sounds/vibrations)
8. Check app icon and splash screen render correctly
9. Generate App Store screenshots (6.7" and 6.5")
10. Final `npx tsc --noEmit` — zero errors

### Budget Estimate
~$1.50

---

## Phase 12: Build & Submit (1 session, ~1 hour + waiting)

### Goal
Build the app with EAS and submit to App Store.

### Steps
1. Configure `eas.json` (from deploy-ios skill)
2. Configure `app.json` with all metadata
3. Run `eas build --platform ios --profile production`
4. Wait for build (~15-30 min, cloud)
5. Run `eas submit --platform ios --profile production`
6. Fill App Store Connect listing (use content-copy.md)
7. Upload screenshots
8. Submit for review

### Budget Estimate
~$0.50 (mostly commands, minimal AI tokens)

---

## Total Estimate

| Phase | Sessions | Estimated Cost |
|---|---|---|
| Phase 0: Init | 1 | $0.50 |
| Phase 1: Foundation | 1 | $1.50 |
| Phase 2: Onboarding | 1 | $0.50 |
| Phase 3: Shock | 1 | $1.00 |
| Phase 4: Crack | 1 | $1.00 |
| Phase 5: Fake Call | 1 | $1.50 |
| Phase 6: Clipper | 1 | $0.75 |
| Phase 7: Ghost | 1 | $1.50 |
| Phase 8: Scream | 1 | $1.00 |
| Phase 9: Fake Update | 1 | $0.75 |
| Phase 10: Ads & IAP | 1 | $1.50 |
| Phase 11: Polish | 1 | $1.50 |
| Phase 12: Submit | 1 | $0.50 |
| **Total** | **13 sessions** | **~$13.50** |

**Well within the $60/month Go budget.** Possibly even lower since many phases are simple and can use free models.

---

## Session Scheduling Recommendation

| Day | Phase | 5hr Window Usage |
|---|---|---|
| Day 1 | Phase 0 + Phase 1 | ~$2.00 (within $12 window) |
| Day 2 | Phase 2 + Phase 3 | ~$1.50 |
| Day 3 | Phase 4 + Phase 5 | ~$2.50 |
| Day 4 | Phase 6 + Phase 7 | ~$2.25 |
| Day 5 | Phase 8 + Phase 9 | ~$1.75 |
| Day 6 | Phase 10 | ~$1.50 |
| Day 7 | Phase 11 + Phase 12 | ~$2.00 |
| **Total** | **7 days** | **~$13.50** |

This keeps each day under ~$2.50, well within the $12/5hr window and $30/week limit.

---

## Phase Dependencies

```
Phase 0 (Init)
  └→ Phase 1 (Foundation)
      ├→ Phase 2 (Onboarding)
      ├→ Phase 3 (Shock) ──────────────┐
      ├→ Phase 4 (Crack) ──────────────┤
      ├→ Phase 5 (Fake Call) ──────────┤
      ├→ Phase 6 (Clipper) ────────────┤
      ├→ Phase 7 (Ghost) ──────────────┤
      ├→ Phase 8 (Scream) ─────────────┤
      └→ Phase 9 (Fake Update) ────────┘
                                      │
                      Phase 10 (Ads & IAP)
                          └→ Phase 11 (Polish)
                              └→ Phase 12 (Submit)
```

- Phases 2-9 can be done in any order after Phase 1
- Phase 10 requires Phase 1 (needs stores and components) but not the pranks
- Phase 11 requires all pranks done
- Phase 12 requires Phase 11 complete