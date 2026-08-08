---
name: deploy-ios
description: Use when building and deploying PrankBox to App Store or TestFlight. Triggers on "deploy", "build for app store", "submit to app store", "testflight", "eas build".
---

# Deploy iOS Skill

This skill guides building and submitting PrankBox to the Apple App Store using Expo EAS Build.

## Prerequisites

1. Apple Developer Account ($99/year, active)
2. EAS CLI installed: `npm install -g eas-cli`
3. Apple Developer account connected to EAS: `eas login`
4. App Store Connect app record created (via App Store Connect website)
5. App signing set up: `eas credentials` (EAS can manage automatically)

## Build Steps

### Step 1: Configure app.json / app.config.ts

Ensure these fields are set:

```json
{
  "expo": {
    "name": "PrankBox",
    "slug": "prankbox",
    "version": "1.0.0",
    "icon": "./assets/images/icon.png",
    "scheme": "prankbox",
    "ios": {
      "bundleIdentifier": "com.yourname.prankbox",
      "buildNumber": "1",
      "supportsTablet": false
    },
    "android": {
      "package": "com.yourname.prankbox",
      "versionCode": 1
    },
    "plugins": ["expo-router", "expo-haptics", "expo-av"]
  }
}
```

### Step 2: Configure eas.json

Create or verify `eas.json`:

```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

### Step 3: Run type check

```bash
npx tsc --noEmit
```

Must pass with zero errors before building.

### Step 4: Build for iOS (production)

```bash
eas build --platform ios --profile production
```

This builds in the cloud (no Mac needed). Takes ~15-30 minutes.
EAS will automatically set up signing credentials on first run.

### Step 5: Submit to App Store

```bash
eas submit --platform ios --profile production
```

Or manually upload the `.ipa` to App Store Connect.

### Step 6: App Store Connect

1. Log into App Store Connect
2. Create app record (if not exists): Name = "PrankBox", Bundle ID = com.yourname.prankbox
3. Add screenshots (required: 6.7" iPhone screenshots minimum)
4. Fill description, keywords, support URL, privacy policy URL
5. Set category: Entertainment
6. Set age rating: 4+ (no realistic violence, no crude humor beyond mild)
7. Add disclaimer in description: "For entertainment purposes only"
8. Submit for review (takes 1-3 days)

## App Store Description Template

```
PrankBox — 7+ pranks in one app!

Shock your friends, crack their screens, detect "ghosts" and more.

⚠️ FOR ENTERTAINMENT PURPOSES ONLY ⚠️
This app is a prank/simulator app. All features are simulated for fun.
No real shocks, no real ghost detection, no actual system changes.

Features:
• Electric Shock Prank
• Crack Screen Prank
• Fake Call
• Hair Clipper Prank
• Ghost Detector
• Scary Popup
• Fake iOS Update

Unlock all pranks + remove ads for just $1.99!

[Privacy Policy URL]
[Terms of Use URL]
```

## Privacy Policy

PrankBox collects ZERO user data. Privacy policy should state:
- No personal data collected
- No analytics or tracking
- No data transmitted to servers
- All app data is stored locally on device
- Ads are served by Google AdMob (mention AdMob's privacy policy)

## Common Rejection Reasons & Fixes

| Reason | Fix |
|---|---|
| "Misleading functionality" | Add "FOR ENTERTAINMENT" to description + in-app onboarding |
| "Impersonates system UI" | Add visible "PRANK MODE" label on fake update/crash screens |
| "No privacy policy" | Add privacy policy URL to App Store Connect |
| "Blank screen on launch" | Test on simulator first, check SafeAreaView usage |
| "Ads without disclosures" | Ensure AdMob SDK is up to date, add "Ads" to age rating |

## Build Version Management

- Increment `version` in `app.json` for each submission
- EAS auto-increments iOS build number with `autoIncrement: true`
- Keep a changelog in your own notes (not in the repo)