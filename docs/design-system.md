# PrankBox Design System

## Visual Language

**Vibe:** Dark, bold, playful, slightly edgy. Pranks feel dramatic and sudden. The UI gets out of the way — the prank IS the experience.

**Principles:**
1. Dark background always — pranks look dramatic on black
2. One bold accent color per prank screen
3. Large touch targets — pranks must activate instantly
4. Minimal chrome — no nav bars, no tabs on prank screens. Full screen = prank
5. Satisfying feedback — every tap has haptic + sound + visual

---

## Color Palette

### Base Colors

| Name | Hex | Usage |
|---|---|---|
| Pitch Black | `#000000` | Prank screen backgrounds |
| Dark Charcoal | `#1A1A1A` | Home screen background |
| Card Gray | `#2A2A2A` | Prank card background |
| Card Gray Hover | `#3A3A3A` | Prank card pressed state |
| White | `#FFFFFF` | Primary text |
| Off White | `#E0E0E0` | Secondary text |
| Gray | `#888888` | Tertiary text, hints |

### Prank Accent Colors

| Prank | Accent Hex | Color Name | Icon |
|---|---|---|---|
| Electric Shock | `#FFD700` | Electric Yellow | `flash` |
| Crack Screen | `#00BFFF` | Ice Blue | `phone-portrait` |
| Fake Call | `#4CAF50` | Phone Green | `call` |
| Hair Clipper | `#FF9800` | Clipper Orange | `cut` |
| Ghost Detector | `#9C27B0` | Ghost Purple | `ghost` |
| Scary Scream | `#D32F2F` | Blood Red | `skull` |
| Fake Update | `#607D8B` | System Gray | `download` |

### UI Status Colors

| Name | Hex | Usage |
|---|---|---|
| Success Green | `#4CAF50` | Premium unlocked, success states |
| Warning Amber | `#FFC107` | Locked content, caution |
| Error Red | `#FF3B30` | Errors, destructive actions |
| Premium Gold | `#FFD700` | Premium badge, IAP prompt |

---

## Typography

### Font Family

Use **Expo Google Fonts** (free, no license cost):

| Role | Font | Weights | Fallback |
|---|---|---|---|
| Display/Headlines | `Inter` | 800 (ExtraBold) | System |
| Body Text | `Inter` | 400 (Regular), 500 (Medium) | System |
| Prank Numbers/Scores | `SpaceMono` | 700 (Bold) | System monospace |
| Buttons | `Inter` | 600 (SemiBold) | System |

### Type Scale (React Native)

| Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Hero | 42 | 800 | 50 | Onboarding title |
| H1 | 32 | 800 | 40 | Prank screen title |
| H2 | 24 | 700 | 32 | Section headers |
| H3 | 18 | 600 | 26 | Prank card title |
| Body | 16 | 400 | 24 | Descriptions |
| Caption | 13 | 400 | 18 | Hints, timestamps |
| Micro | 11 | 500 | 14 | Badges, labels |

---

## Spacing System

Base unit: **8px**

| Name | Value | Usage |
|---|---|---|
| xs | 4 | Tight spacing, icon gaps |
| sm | 8 | Component internal padding |
| md | 16 | Default padding, card gaps |
| lg | 24 | Section spacing |
| xl | 32 | Major section breaks |
| xxl | 48 | Screen-level vertical spacing |

---

## Layout Spec

### Home Screen (Prank Grid)

```
┌─────────────────────────────┐
│  ┌─ Safe Area ──────────┐   │
│  │                      │   │
│  │  PrankBox        ⚙️  │   │  ← Header: logo left, settings right
│  │                      │   │
│  │  ┌────┐    ┌────┐   │   │  ← Grid: 2 columns
│  │  │ ⚡ │    │ 📱 │   │   │     Card: 160x160
│  │  │Shock│   │Crack│   │   │     Icon: 48px
│  │  └────┘    └────┘   │   │     Title: H3
│  │                      │   │     Accent border: 4px left
│  │  ┌────┐    ┌────┐   │   │
│  │  │ 📞 │    │ ✂️ │   │   │  ← Locked cards show 🔒 badge
│  │  │Call │   │Clip │   │   │     Pressed state: scale 0.95
│  │  └────┘    └────┘   │   │
│  │                      │   │
│  │  ┌────┐    ┌────┐   │   │
│  │  │ 👻 │    │ 💀 │   │   │
│  │  │Ghost│   │Scream│  │   │
│  │  └────┘    └────┘   │   │
│  │                      │   │
│  │  ┌────┐             │   │
│  │  │ ⬇️ │             │   │
│  │  │Update            │   │
│  │  └────┘             │   │
│  │                      │   │
│  └──────────────────────┘   │
│  ┌─ Banner Ad (50px) ──┐    │  ← Banner ad at bottom (if not premium)
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### Prank Screen (General)

```
┌─────────────────────────────┐
│  ┌─ Safe Area ──────────┐   │
│  │  ← Back          ⚠️  │   │  ← Back button top-left, disclaimer icon top-right
│  │                      │   │
│  │                      │   │
│  │      FULL SCREEN     │   │  ← Prank fills entire screen
│  │      INTERACTION     │   │     No tabs, no nav beyond back
│  │      AREA            │   │
│  │                      │   │
│  │                      │   │
│  │                      │   │
│  │  "For entertainment  │   │  ← Disclaimer footer (micro text)
│  │   purposes only"      │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

### Prank Card Anatomy

```
┌──────────────────────────┐
│  ┃                       │  ← 4px left accent border (prank color)
│  ┃      ⚡ (48px)        │  ← Centered icon in accent color
│  ┃                       │
│  ┃    Shock Phone        │  ← H3 title, white
│  ┃    Tap to prank       │  ← Caption, gray
│  ┃                       │
│  ┃              🔒  ┌──┐ │  ← Lock badge (if locked) / FREE badge
│  ┃                  └──┘ │
└──────────────────────────┘
160 x 160 px, rounded 16px, #2A2A2A bg
Pressed: scale 0.95, bg #3A3A3A, haptic medium
```

---

## Component Specs

### PrankCard

| Prop | Type | Description |
|---|---|---|
| prank | PrankConfig | The prank config object |
| onPress | () => void | Navigate to prank screen |
| isLocked | boolean | Show lock badge |

### PrankScreenWrapper

| Prop | Type | Description |
|---|---|---|
| accentColor | string | Prank accent color for back button |
| showDisclaimer | boolean | Show "for entertainment" footer |
| children | ReactNode | Prank content |

### LockBadge

| Prop | Type | Description |
|---|---|---|
| isFree | boolean | Shows FREE (green) or lock icon (amber) |

### BannerAd

| Prop | Type | Description |
|---|---|---|
| isPremium | boolean | If true, returns null (no ads) |

### IAPPrompt

| Prop | Type | Description |
|---|---|---|
| visible | boolean | Show/hide modal |
| onPurchase | () => void | Trigger IAP |
| onClose | () => void | Dismiss modal |

---

## Animation Standards

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Card press | scale 0.95 | 100ms | ease-out |
| Screen enter | fade + slide up 20px | 300ms | ease-out |
| Back button leave | fade + slide right 20px | 200ms | ease-in |
| Prank trigger | Per-prank spec | Per-prank | Per-prank |
| Lock badge wiggle | rotate -3deg to 3deg | 300ms x2 | spring |
| IAP modal enter | scale 0.8→1 + fade | 250ms | spring (damping 0.8) |

---

## Haptics Standards

| Interaction | Haptic | Pattern |
|---|---|---|
| Card tap | Impact Medium | Single |
| Prank trigger | Impact Heavy | Single |
| Prank active (looping) | Impact Light | Every 500ms while active |
| Scary popup | Notification Warning | Single |
| Premium unlocked | Notification Success | Single |
| Back button | Impact Light | Single |
| Error/fail | Notification Error | Single |

---

## Screen Transition Spec

| From | To | Transition |
|---|---|---|
| Home → Prank | Push (slide left) | 300ms ease-out |
| Prank → Home | Pop (slide right) | 200ms ease-in |
| Home → Settings | Push (slide left) | 250ms ease-out |
| Settings → Home | Pop (slide right) | 200ms ease-in |

All transitions use the native Expo Router transition (platform default). No custom transitions needed — keep it native feel.