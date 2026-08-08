# Prank Specs — Each Prank's Detailed Design

## Shared Prank Screen Pattern

Every prank screen has:
- Back button (top-left, accent colored)
- Disclaimer icon (top-right, taps to show full disclaimer modal)
- Full screen interaction area
- "For entertainment purposes only" footer (micro text)
- Cleanup on unmount (stop animations, sounds, haptics)

---

## 1. Electric Shock ⚡

### Concept
Phone vibrates violently, screen flashes electric blue/yellow, buzzing sound plays. User holds phone or hands it to a friend.

### Constants
```typescript
const SHOCK_CONFIG = {
  id: 'shock',
  name: 'Shock Phone',
  description: 'Tap to shock',
  icon: 'flash',
  isFree: true,
  color: '#FFD700',
  soundFile: require('@/assets/sounds/electric-buzz.mp3'),
}
```

### UI Layout
```
┌─────────────────────────────┐
│  ←              ⚠️          │
│                             │
│                             │
│         ┌─────────┐         │
│         │         │         │
│         │   ⚡    │         │  ← Lightning bolt SVG, 120x120
│         │  (animated)      │     Pulses when idle
│         │         │         │     Fills screen with arcs when active
│         └─────────┘         │
│                             │
│      TAP TO ACTIVATE        │  ← Caption, pulses
│                             │
│                             │
│  For entertainment only     │
└─────────────────────────────┘
```

### Interaction Flow
1. Screen loads → lightning bolt icon pulses gently (scale 1.0→1.1→1.0, 1500ms loop)
2. User taps anywhere → triggers shock state:
   - Screen background flashes yellow→white→yellow rapidly (100ms intervals)
   - Electric arc animation surges from bolt icon to screen edges
   - Haptic: Impact Heavy, repeated every 200ms
   - Sound: electric-buzz.mp3 loops
   - Lightning bolt scales to 1.5x and rotates rapidly
3. User taps again → stops shock state, returns to idle
4. Back button → cleanup: cancelAnimation, stop haptics, unload sound

### Animation Details
- Idle pulse: `withRepeat(withSequence(withTiming(1.1, {duration: 750}), withTiming(1.0, {duration: 750})), -1)`
- Shock flash: `withRepeat(withSequence(withTiming(1, {duration: 50}), withTiming(0, {duration: 50})), -1)` on opacity overlay
- Electric arcs: 4 lines from center radiating outward, `withTiming(width, {duration: 200})` staggered

### Sound
- `electric-buzz.mp3` — looping electric/zapping sound
- Source: freesound.org, search "electric buzz" or "electric shock"
- Format: MP3, <500KB, loops seamlessly

---

## 2. Crack Screen 📱

### Concept
Tap screen → realistic crack appears with glass shatter sound. Hand phone to friend and act innocent.

### Constants
```typescript
const CRACK_CONFIG = {
  id: 'crack',
  name: 'Crack Screen',
  description: 'Tap to crack',
  icon: 'phone-portrait',
  isFree: true,
  color: '#00BFFF',
  soundFile: require('@/assets/sounds/glass-crack.mp3'),
}
```

### UI Layout
```
┌─────────────────────────────┐
│  ←              ⚠️          │
│                             │
│                             │
│      [Transparent area      │
│       — tap anywhere        │
│       to crack]             │
│                             │
│                             │  ← Multiple taps = more cracks
│                             │     Cracks persist (drawn as SVG)
│                             │
│                             │
│  For entertainment only     │
└─────────────────────────────┘
```

### Interaction Flow
1. Screen loads → transparent, shows subtle hint text "Tap anywhere to crack" (fades after 3 seconds)
2. User taps → at tap location:
   - Shatter sound plays (one-shot, not looped)
   - Haptic: Impact Heavy
   - Crack SVG renders at tap coordinates with random pattern
   - Brief flash overlay (white, 100ms)
3. Each additional tap adds a new crack at new location (accumulates)
4. Long press (2 sec) → "Reset" button appears → clears all cracks
5. Back → cleanup: no looping sounds to stop

### Crack Pattern Generation
- Use random seed to generate branching crack lines from tap point
- Main line: 50-150px, random angle
- Branches: 3-5 off main line, 20-60px, random angles
- Render as SVG paths with white stroke, 1.5px width, opacity 0.9
- Store as array of crack paths in state (accumulates)

### Sound
- `glass-crack.mp3` — single glass shatter, <300KB
- Source: freesound.org or mixkit.co, search "glass break" or "screen crack"

---

## 3. Fake Call 📞

### Concept
Set up a fake incoming call. Schedule it for X seconds later, or trigger immediately. Phone rings with a fake caller — great for escaping awkward situations.

### Constants
```typescript
const FAKECALL_CONFIG = {
  id: 'fakecall',
  name: 'Fake Call',
  description: 'Schedule a fake call',
  icon: 'call',
  isFree: true,
  color: '#4CAF50',
  soundFile: require('@/assets/sounds/phone-ring.mp3'),
}
```

### UI Layout — Setup Screen
```
┌─────────────────────────────┐
│  ←              ⚠️          │
│                             │
│  Caller Name                │
│  ┌─────────────────────┐   │
│  │ Mom                 │   │  ← Text input
│  └─────────────────────┘   │
│                             │
│  Caller Number              │
│  ┌─────────────────────┐   │
│  │ +1 555-0000         │   │  ← Text input
│  └─────────────────────┘   │
│                             │
│  Delay                      │
│  [5s] [10s] [30s] [1min]   │  ← Chip selector
│                             │
│  ┌─────────────────────┐   │
│  │   START FAKE CALL   │   │  ← Big green button
│  └─────────────────────┘   │
│                             │
│  For entertainment only     │
└─────────────────────────────┘
```

### UI Layout — Incoming Call Screen (Full Screen Takeover)
```
┌─────────────────────────────┐
│                             │
│         👤 (avatar)         │  ← Circle with initials, 100x100
│                             │
│        Mom                  │  ← Caller name (H1)
│        +1 555-0000          │  ← Number (caption)
│                             │
│                             │
│   ┌──────┐      ┌──────┐   │
│   │  🔴  │      │  🟢  │   │  ← Decline (red) | Accept (green)
│   │Decline│     │Accept│   │     Circular buttons, 70x70
│   └──────┘      └──────┘   │
│                             │
│  [swipe up to ↔ answer]     │
└─────────────────────────────┘
```

### Interaction Flow
1. Setup screen → user enters name, number, selects delay
2. Tap "START FAKE CALL" → navigate to a waiting screen or minimize
3. After delay → full-screen incoming call appears
4. Phone vibrates in ringtone pattern + ring sound loops
5. Decline → stops ring, returns to app
6. Accept → shows "call connected" screen with timer counting up, mute/speaker buttons (non-functional, just visual)
7. End call button → returns to app

### Sound
- `phone-ring.mp3` — classic phone ringtone loop, <200KB
- Source: freesound.org, search "phone ring" or "ringtone"

---

## 4. Hair Clipper ✂️

### Concept
Phone vibrates like a real hair clipper. Hold it near someone's head. Shaving sound + intense vibration.

### Constants
```typescript
const CLIPPER_CONFIG = {
  id: 'clipper',
  name: 'Hair Clipper',
  description: 'Tap to buzz',
  icon: 'cut',
  isFree: false,
  color: '#FF9800',
  soundFile: require('@/assets/sounds/clipper-buzz.mp3'),
}
```

### UI Layout
```
┌─────────────────────────────┐
│  ←              ⚠️          │
│                             │
│                             │
│         ┌─────────┐         │
│         │  ✂️     │         │  ← Clipper icon, 100x100
│         │ (vibrating)       │     Slight tremble animation when active
│         └─────────┘         │
│                             │
│      TAP TO ACTIVATE        │  ← Caption
│                             │
│     ┌───────────────┐       │
│     │ INTENSITY     │       │  ← Slider (when active)
│     │ ━━━━●━━━━━━━ │       │     Low <—> Max
│     └───────────────┘       │
│                             │
│  For entertainment only     │
└─────────────────────────────┘
```

### Interaction Flow
1. Screen loads → idle clipper icon
2. User taps → activates:
   - Sound: clipper-buzz.mp3 loops
   - Haptic: continuous vibration pattern (200ms on, 100ms off, loop)
   - Icon trembles (offset random ±2px, 50ms loop)
   - Intensity slider appears (controls vibration intensity)
3. User taps again → stops everything
4. Slider adjusts haptic intensity dynamically (Light → Heavy impact)
5. Back → cleanup: stop haptics, unload sound

### Sound
- `clipper-buzz.mp3` — beard trimmer buzzing, loops seamlessly, <400KB
- Source: freesound.org, search "hair clipper" or "trimmer" or "razor"

---

## 5. Ghost Detector 👻

### Concept
Fake radar/EMF detector. Shows "ghosts" on a radar sweep with creepy atmosphere. Dots appear as "entities" near you.

### Constants
```typescript
const GHOST_CONFIG = {
  id: 'ghost',
  name: 'Ghost Detector',
  description: 'Find supernatural',
  icon: 'ghost',
  isFree: false,
  color: '#9C27B0',
  soundFile: require('@/assets/sounds/ghost-ambient.mp3'),
}
```

### UI Layout
```
┌─────────────────────────────┐
│  ←              ⚠️          │
│                             │
│     ┌─────────────────┐     │
│     │   Radar Circle  │     │  ← Circular radar, 280x280
│     │                 │     │     Green sweep line rotating
│     │    ○  ●         │     │     Ghost dots appear/disappear
│     │       ○         │     │     "YOU" dot in center
│     │    ●            │     │
│     └─────────────────┘     │
│                             │
│  ┌─ EMF Reading ──────────┐ │
│  │  ██████░░░░  2.7 mG   │ │  ← Animated EMF bar
│  │  LEVEL: MODERATE       │ │
│  │  Entity: POLTERGEIST   │ │  ← Random ghost type text
│  │  Distance: 3.2m        │ │  ← Random distance
│  └────────────────────────┘ │
│                             │
│  For entertainment only     │
└─────────────────────────────┘
```

### Interaction Flow
1. Screen loads → ambient creepy sound starts (low volume loop)
2. Radar sweep line begins rotating (360deg, 3000ms loop)
3. Every 2-4 seconds → random ghost dot appears on radar:
   - Dots are colored circles (white, red, purple)
   - Fade in → stay 5-8 seconds → fade out
   - Position is random within radar circle
4. EMF bar fluctuates randomly (height 2-7 out of 10)
5. Text labels cycle through random ghost data:
   - Types: POLTERGEIST, SHADOW FIGURE, WRAITH, SPIRIT, PHANTOM, REVENANT
   - Distances: 1.2m - 8.5m (random)
   - Level: CALM / MODERATE / HIGH / EXTREME (based on EMF bar)
6. When EMF hits 8+ → haptic warning fires once + "ENTITY CLOSE" flashes red
7. Back → cleanup: stop animation, stop sound

### Animation Details
- Sweep line: `withRepeat(withTiming(360, {duration: 3000}), -1)`
- Ghost dots: fade with `withSequence(withTiming(1, {duration: 500}), withDelay(random 3000-5000), withTiming(0, {duration: 800}))`
- EMF bar: `withRepeat(withSequence(withTiming(random 0.2-0.8, {duration: 500}), withTiming(random 0.2-0.8, {duration: 500})), -1)`

### Sound
- `ghost-ambient.mp3` — low drone/hum ambient, <500KB, loops
- Source: freesound.org, search "ambient drone" or "creepy atmosphere"
- Optional: `ghost-blip.mp3` — short blip when new dot appears (<50KB)

---

## 6. Scary Scream 💀

### Concept
Looks like a calm, boring screen (instructions, quiz, etc.) → sudden horror face + scream sound + vibration. Classic jump scare.

### Constants
```typescript
const SCREAM_CONFIG = {
  id: 'scream',
  name: 'Scary Popup',
  description: 'Surprise your friends',
  icon: 'skull',
  isFree: false,
  color: '#D32F2F',
  soundFile: require('@/assets/sounds/scream.mp3'),
}
```

### UI Layout — Decoy Screen (Phase 1)
```
┌─────────────────────────────┐
│  ←              ⚠️          │
│                             │
│     Find the hidden         │  ← Decoy: "spot the difference"
│     difference in this       │     or "stare at the dot"
│     image...                │
│                             │
│         ┌───────┐           │
│         │  ●    │           │  ← Simple image/dot puzzle
│         │       │           │  ← User stares at screen
│         └───────┘           │
│                             │
│    Take your time...        │
│                             │
│  For entertainment only     │
└─────────────────────────────┘
```

### UI Layout — Jump Scare (Phase 2)
```
┌─────────────────────────────┐
│                             │
│                             │
│      [HORROR FACE           │  ← Full-screen scary image
│       FILLS SCREEN]         │     (scary face, 100% width/height)
│                             │
│                             │
│      AAAAAA! (scream)        │  ← Scream sound at max volume
│                             │
│                             │  ← Screen vibrates
│                             │
│                             │
└─────────────────────────────┘
```

### Interaction Flow
1. Screen loads → shows decoy puzzle/game ("find the hidden object")
2. After random delay (3-7 seconds) → JUMP SCARE:
   - Screen instantly cuts to full-screen horror image
   - Scream sound at max volume (one-shot, not looped)
   - Haptic: Notification Warning (long)
   - Phone vibrates for 500ms
   - Screen shakes (offset ±10px, 50ms intervals, for 500ms)
3. After 2 seconds → auto return to calm screen + "GOTCHA!" text
4. Tap to scare again (new random delay)
5. Back → cleanup: stop sound (in case user backs out during scare)

### Decoy Options (randomized each time)
1. "Find the hidden difference" — show two nearly identical images
2. "Stare at the dot for 10 seconds" — show a dot in center
3. "What do you see in this image?" — show ambiguous image
4. "Concentrate on the number" — show counting animation

### Sound
- `scream.mp3` — horror scream, <300KB, very loud
- Source: freesound.org, search "horror scream" or "scary shout"
- Image: Use a free horror face image, or generate with free AI tools

---

## 7. Fake Update ⬇️

### Concept
Realistic-looking iOS update screen. Hand phone to friend, they think their phone is updating.

### Constants
```typescript
const FAKEUPDATE_CONFIG = {
  id: 'fakeupdate',
  name: 'Fake Update',
  description: 'Fake iOS update',
  icon: 'download',
  isFree: false,
  color: '#607D8B',
  soundFile: null, // no sound, just visual
}
```

### UI Layout
```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│          🍎 (Apple logo)    │  ← White Apple logo, 80x80, centered
│                             │
│                             │
│                             │
│      iOS 19.4               │  ← System font, white
│      Installing...          │
│                             │
│   ━━━━━━━━━●━━━━━━━  47%   │  ← Progress bar + percentage
│                             │
│                             │
│   Do not turn off your      │  ← System gray text
│   device                    │
│                             │
│                             │
│       [PRANK]               │  ← Hidden: tap 5x rapidly to exit
└─────────────────────────────┘
```

### Interaction Flow
1. Screen loads → black screen, white Apple logo fades in (500ms)
2. "iOS 19.4 / Installing..." text appears
3. Progress bar starts at 0% → animates to 100% over ~60 seconds (very slow)
4. At 100% → shows "Update Complete" → reboots to fake lock screen
5. Hidden exit: tap the Apple logo 5 times rapidly → exits prank
6. Volume buttons → ignored (or show nothing)
7. Back button → hidden (swipe down from top 3 times to exit, or 5 taps on logo)
8. "PRANK" indicator: very small, bottom corner, 30% opacity (for App Store compliance)

### Progress Bar Animation
- Start at 0, `withTiming(100, {duration: 60000})` — 60 seconds to 100%
- Speeds up slightly near end (ease-in)
- Percentage text follows the progress value

### Important Note
This prank must NOT block the actual back gesture. App Store will reject it. The back button should always work, just be visually subtle. Use a small "PRANK" label in corner for compliance.

---

## Prank Priority & Free/Paid Split

| Prank | isFree | Reason |
|---|---|---|
| Electric Shock | true | Hook — most viral, gets downloads |
| Crack Screen | true | Hook — instantly shareable |
| Fake Call | true | Practical joke — keeps daily users |
| Hair Clipper | false | Premium — prank novelty |
| Ghost Detector | false | Premium — complex UI, high value |
| Scary Scream | false | Premium — high entertainment |
| Fake Update | false | Premium — high novelty |

**Free: 3 pranks** — enough to hook users and generate ad revenue
**Premium: 4 pranks** — enough to justify $1.99 IAP