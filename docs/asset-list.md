# Asset List — Free Sources & What to Download

## Overview

All assets can be obtained for **$0**. No paid asset packs needed. Below is the exact list of what to download and where to get it.

---

## Sound Effects (7 files needed)

### Where to Download (Free)

| Site | URL | License | How to Use |
|---|---|---|---|
| **Freesound.org** | freesound.org | CC0 / CC BY (attribute if needed) | Create free account, download MP3 |
| **Mixkit** | mixkit.co/free-sound-effects | Mixkit License (free, no attribution) | Download directly, no account |
| **Pixabay Sounds** | pixabay.com/sound-effects | Pixabay License (free, no attribution) | Download directly, no account |

### Required Sound Files

| File | Purpose | Search Terms | Suggested Source |
|---|---|---|---|
| `electric-buzz.mp3` | Electric shock buzz loop | "electric buzz", "electric shock", "zap loop" | Freesound.org |
| `glass-crack.mp3` | Crack screen shatter | "glass break", "glass shatter", "screen crack" | Mixkit or Pixabay |
| `phone-ring.mp3` | Fake call ringtone | "phone ring", "ringtone", "phone ringing" | Pixabay |
| `clipper-buzz.mp3` | Hair clipper buzzing | "hair clipper", "trimmer", "razor buzz", "shaver" | Freesound.org |
| `ghost-ambient.mp3` | Ghost detector ambient drone | "ambient drone", "creepy atmosphere", "horror ambient" | Freesound.org |
| `scream.mp3` | Jump scare scream | "horror scream", "scary shout", "jump scare scream" | Pixabay or Mixkit |
| `ghost-blip.mp3` (optional) | Ghost dot appear blip | "radar blip", "scanner beep", "sonar" | Freesound.org |

### Download Instructions
1. Go to the source site
2. Search using the terms above
3. Download MP3 format (smallest size, universally supported)
4. Trim/reduce if over 500KB using free tool: https://mp3cut.net (online, free)
5. Place files in `assets/sounds/`
6. Keep each file under 500KB for fast app load
7. Preferred sample rate: 44.1kHz, bitrate: 128kbps

### File Size Targets
```
electric-buzz.mp3    ~200KB (looping, short)
glass-crack.mp3      ~150KB (one-shot)
phone-ring.mp3       ~200KB (looping, short)
clipper-buzz.mp3    ~300KB (looping)
ghost-ambient.mp3    ~400KB (looping ambient)
scream.mp3           ~200KB (one-shot)
ghost-blip.mp3       ~30KB (one-shot blip)
─────────────────────────
Total:               ~1.5MB  (well within app size limits)
```

---

## App Icon & Images

### App Icon (1024x1024 PNG)

**Option 1: AI-Generated (Free)**
| Tool | URL | Cost | How |
|---|---|---|---|
| Bing Image Creator | bing.com/create | Free | "App icon for prank app, electric shock theme, dark background, bold yellow lightning bolt, minimalist, rounded square" |
| Leonardo.ai | leonardo.ai | Free tier (150 credits/day) | Use "App Icon" preset, describe prank theme |
| Ideogram | ideogram.ai | Free | "Minimalist app icon, prank box, dark with neon colors, modern" |

**Recommended prompt:**
```
Minimalist app icon for a prank app called PrankBox. Dark black
background with bold electric yellow lightning bolt in center.
Slightly playful but clean. Rounded square shape. No text.
Suitable for iOS app icon. 1024x1024.
```

**Option 2: Use Figma (Free)**
1. Open Figma (free tier)
2. Create 1024x1024 frame
3. Black background
4. Add lightning bolt icon (Ionicons "flash" — copy from figma community)
5. Export as PNG

**Export requirements:**
- Size: 1024x1024px
- Format: PNG (no transparency — opaque background)
- No rounded corners (Apple applies the mask)

### App Store Screenshots

Take screenshots on device/simulator, then size for App Store.

| Device | Size (Portrait) | Required |
|---|---|---|
| iPhone 6.7" (15 Pro Max) | 1290x2796 | Yes (required) |
| iPhone 6.5" (11 Pro Max) | 1242x2688 | Yes (required) |
| iPhone 5.5" (8 Plus) | 1242x2208 | Optional |

**Screenshot plan (need 3-6 minimum):**
1. Home grid with all pranks visible
2. Electric shock screen mid-prank (flashing)
3. Crack screen with cracks
4. Ghost detector with radar
5. Fake call incoming screen
6. IAP unlock modal

**Free screenshot design tool:**
- Use Figma (free) to add device frames and marketing text
- Or use https://previewed.app (free tier)
- Or just use raw screenshots (Apple allows this)

---

## Horror Face Image (Scary Popup)

### Source (Free, CC0)
| Site | URL | License |
|---|---|---|
| Pixabay | pixabay.com/images/search/horror-face | Pixabay License (free) |
| Pexels | pexels.com/search/horror | Pexels License (free) |
| Unsplash | unsplash.com/sphotos/scary-face | Unsplash License (free) |

**Search terms:** "horror face", "scary face", "creepy face", "jump scare"

**Requirements:**
- Resolution: at least 1080x1920 (phone screen size)
- Format: JPG (smaller than PNG for photos)
- File size: under 1MB
- Must NOT be too graphic/gory — App Store rejects excessive gore
- A creepy but not bloody face works best

**Place in:** `assets/images/scary-face.jpg`

---

## Fonts (Free)

### Source: Google Fonts via Expo

No manual download needed. Expo Google Fonts package handles it.

### Install (during build phase)
```bash
npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/space-mono
```

### Fonts Used

| Font | Weights | Usage | Install Package |
|---|---|---|---|
| Inter | 400, 500, 600, 700, 800 | All UI text | `@expo-google-fonts/inter` |
| Space Mono | 700 | Numbers, scores, timer | `@expo-google-fonts/space-mono` |

### Usage in Code
```typescript
import { useFonts } from 'expo-font'
import { Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold } from '@expo-google-fonts/inter'

// In root layout:
const [fontsLoaded] = useFonts({
  'Inter-Regular': Inter_400Regular,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-ExtraBold': Inter_800ExtraBold,
})

if (!fontsLoaded) return null // splash screen while loading
```

---

## Icons (Free, Already Included)

### Source: @expo/vector-icons (Ionicons)

No download needed — comes with Expo.

### Icons Used in App

| Prank/Feature | Icon Name | Icon Set |
|---|---|---|
| Electric Shock | `flash` | Ionicons |
| Crack Screen | `phone-portrait` | Ionicons |
| Fake Call | `call` | Ionicons |
| Hair Clipper | `cut` | Ionicons |
| Ghost Detector | `ghost` | Ionicons (if available) or use `skull-outline` |
| Scary Popup | `skull` | Ionicons |
| Fake Update | `download` | Ionicons |
| Settings | `settings` | Ionicons |
| Back | `chevron-back` | Ionicons |
| Lock | `lock-closed` | Ionicons |
| Disclaimer | `warning` | Ionicons |
| Close | `close` | Ionicons |
| Share | `share-social` | Ionicons |
| Star (rating) | `star` | Ionicons |

### Usage in Code
```typescript
import { Ionicons } from '@expo/vector-icons'

<Ionicons name="flash" size={48} color="#FFD700" />
```

---

## SVG Graphics (Optional)

### Legend
Some pranks need custom SVG shapes. These are **code-generated** — no download needed.

| Prank | SVG Needed | How to Render |
|---|---|---|
| Crack Screen | Random crack lines | Use `react-native-svg` (already in Expo) |
| Ghost Detector | Radar circle, sweep line, ghost dots | Use `react-native-svg` animated with Reanimated |
| Electric Shock | Lightning bolt + electric arcs | Use `react-native-svg` with Reanimated |
| Fake Update | Apple logo | Use Ionicons `logo-apple` or simple SVG path |

### Install (during build phase)
```bash
npx expo install react-native-svg
```

---

## App Store Metadata Files

### Privacy Policy (Free Generator)

Use a free generator to create a privacy policy:

| Tool | URL | Cost |
|---|---|---|
| App Privacy Policy Generator | app-privacy-policy-generator.firebaseapp.com | Free |
| Termly | termly.io | Free tier |
| Free Privacy Policy | freeprivacypolicy.com | Free |

**PrankBox privacy points:**
- Collects: Nothing
- Stores: Only user settings (haptics on/off, premium status) — locally on device
- Transmits: Nothing
- Third-party: Google AdMob (if ads enabled) — links to AdMob privacy policy
- No analytics, no tracking, no data sharing

### Terms of Use (Free Generator)

| Tool | URL | Cost |
|---|---|---|
| Terms Feed | termsfeed.com | Free tier |
| Termly | termly.io | Free tier |

**Key clauses to include:**
1. App is for entertainment purposes only
2. User assumes all responsibility for pranks
3. Developers not liable for consequences
4. No medical advice, no real functionality

### Hosting the Privacy Policy & Terms

| Option | URL | Cost |
|---|---|---|
| GitHub Pages | pages.github.com | Free (host as .html in a repo) |
| Notion | notion.so | Free (publish page as public link) |
| Google Sites | sites.google.com | Free |

---

## Asset Checklist (Download Before Building)

- [ ] `electric-buzz.mp3` — from freesound.org
- [ ] `glass-crack.mp3` — from mixkit.co
- [ ] `phone-ring.mp3` — from pixabay.com
- [ ] `clipper-buzz.mp3` — from freesound.org
- [ ] `ghost-ambient.mp3` — from freesound.org
- [ ] `scream.mp3` — from pixabay.com
- [ ] App icon (1024x1024 PNG) — from AI generator or Figma
- [ ] Horror face image (`scary-face.jpg`) — from pixabay.com
- [ ] Privacy policy HTML — from generator, hosted on GitHub Pages
- [ ] Terms of use HTML — from generator, hosted on GitHub Pages

**Total download time estimate: 30-45 minutes**

---

## Assets NOT Needed (Save Time)

- No background music (pranks use sound effects only)
- No onboarding illustrations (text-based onboarding)
- No app tutorial video (App Store doesn't require it)
- No promotional video (optional, skip for v1)
- No custom splash screen image (use Expo default + solid color)