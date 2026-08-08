# Ad & Monetization Strategy

## Revenue Model

| Stream | Mechanism | Expected Revenue |
|---|---|---|
| **Banner Ads** | Bottom of home screen (non-premium only) | $0.10-0.50 per 1K impressions |
| **Interstitial Ads** | Full-screen ad between prank sessions | $1-5 per 1K impressions |
| **IAP — Unlock All** | One-time $1.99 to unlock all + remove ads | ~2-3% conversion rate |

## AdMob Setup (Free)

### Create AdMob Account
1. Go to https://admob.google.com
2. Sign in with Google account
3. Add your app (iOS, then Android later)
4. Create ad units:

| Ad Unit Type | Name | Format |
|---|---|---|
| Banner | PrankBox Home Banner | 320x50 / Smart Banner |
| Interstitial | PrankBox Interstitial | Full screen |

5. Copy the ad unit IDs (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

### Ad Unit ID Strategy (Dev vs Prod)

```typescript
const AD_CONFIG = {
  banner: __DEV__
    ? 'ca-app-pub-3940256099942544/6300978111'  // Google test ID
    : 'ca-app-pub-YOUR-ID/YOUR-BANNER-ID',
  interstitial: __DEV__
    ? 'ca-app-pub-3940256099942544/1033173712'  // Google test ID
    : 'ca-app-pub-YOUR-ID/YOUR-INTERSTITIAL-ID',
}
```

**Always use Google's test ad IDs during development. Showing real ads in dev violates AdMob policy and can get your account banned.**

---

## Ad Placement Rules

### Banner Ad
- **Where:** Bottom of home screen, above safe area
- **When:** Always visible on home screen (if not premium)
- **NOT shown on:** Prank screens, settings screen, onboarding (would disrupt experience)
- **Size:** 50px height, full width
- **Premium behavior:** Hidden entirely (returns null)

### Interstitial Ad
- **When to show:**
  1. After a user opens a prank for the **3rd time** in one session (not every time — annoying)
  2. When a user taps a locked prank **before** showing the IAP modal
- **NOT shown on:**
  - First prank open (let them enjoy it)
  - Second prank open (building engagement)
  - Onboarding (never)
  - Settings (never)
- **Frequency cap:** Max 1 interstitial per 60 seconds

### Ad Frequency Logic
```typescript
// In useAdStore
interface AdStore {
  prankOpenCount: number
  lastInterstitialTime: number
  incrementPrankOpen: () => void
  shouldShowInterstitial: () => boolean
}

const shouldShowInterstitial = () => {
  if (isPremium) return false
  if (prankOpenCount < 3) return false
  if (Date.now() - lastInterstitialTime < 60_000) return false
  return true
}
```

---

## IAP Setup

### Product Configuration

| Product ID | Price | Description |
|---|---|---|
| `com.yourname.prankbox.unlock` | $1.99 | Unlock all pranks + remove ads |

### App Store Connect Setup
1. Go to App Store Connect → Your App → In-App Purchases
2. Create new IAP:
   - Type: Non-Consumable (buy once, keep forever)
   - Reference Name: "Unlock All Pranks"
   - Product ID: `com.yourname.prankbox.unlock`
   - Price: $1.99 (Price Tier 3)
   - Description: "Unlock all 7 pranks and remove all ads forever."
3. Add screenshot of IAP modal
4. Submit for review (happens with app submission)

### IAP Flow

```
User taps locked prank
    → Check if premium
        → If premium: open prank
        → If not premium: show IAP modal
            → User taps "Unlock Now"
                → Trigger Apple IAP sheet
                    → Purchase succeeds → set isPremium=true, unlock all
                    → Purchase fails → show error, close modal
            → User taps "Maybe Later"
                → Close modal (show interstitial ad instead)
            → User taps "Restore"
                → Call restorePurchases() → check for previous purchase
```

### IAP Implementation (react-native-iap recommended)

```typescript
import * as RNIap from 'react-native-iap'

const PRODUCT_ID = 'com.yourname.prankbox.unlock'

// Initialize
await RNIap.initConnection()

// Fetch product
const products = await RNIap.getProducts({ skus: [PRODUCT_ID] })

// Purchase
const purchase = await RNIap.requestPurchase({ sku: PRODUCT_ID })

// Verify receipt
// (For $1.99 non-consumable, Apple handles server-side verification,
//  no backend needed. Just check purchase state locally.)

// Restore
const purchases = await RNIap.getAvailablePurchases()
const hasPurchased = purchases.some(p => p.productId === PRODUCT_ID)
```

---

## Revenue Projections

### Conservative Scenario (First 3 Months)

| Metric | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Downloads | 500 | 2,000 | 5,000 |
| Daily active users | 50 | 200 | 500 |
| Banner impressions/day | 200 | 800 | 2,000 |
| Interstitial impressions/day | 100 | 400 | 1,000 |
| IAP purchases | 5 | 20 | 50 |

| Revenue Source | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Banner ads | $0.10 | $0.40 | $1.00 |
| Interstitial ads | $0.50 | $2.00 | $5.00 |
| IAP (2% conversion) | $9.95 | $39.80 | $99.50 |
| **Total/month** | **$10.55** | **$42.20** | **$105.50** |

### Viral Scenario (TikTok Promotion)

If a prank video goes viral (100K+ views):

| Metric | Viral Week | Month After |
|---|---|---|
| Downloads in 48hrs | 50,000 | — |
| Active users | 10,000 | 5,000 |
| Banner impressions/day | 40,000 | 20,000 |
| Interstitials/day | 20,000 | 10,000 |
| IAP purchases | 500 | 200 |

| Revenue | Viral Week | Next Month |
|---|---|---|
| Banner ads | $20 | $10/day |
| Interstitial ads | $100 | $50/day |
| IAP (2% conversion) | $995 | $398/day |
| **Total** | **~$1,115/week** | **~$458/day** |

> These are rough estimates. Actual eCPM varies by country, ad quality, and user engagement.

---

## App Store Submission Notes for Ads

### App Store Connect Privacy Labels (Required)

When submitting, declare:

| Data Type | Collected | Used For |
|---|---|---|
| Product ID (IAP) | Yes | Functionality |
| Purchase History | Yes | Functionality |
| Device ID | Yes | Third-party Ads (AdMob) |
| Usage Data | Yes | Third-party Ads (AdMob) |
| Diagnostics | Yes | App Functionality |

**Everything else: No. PrankBox collects nothing else.**

### App Description Must Disclose
```
• Ads: Banner and interstitial ads served by Google AdMob
• In-App Purchases: Unlock all pranks for $1.99 (one-time)
• No subscriptions
• No data collection beyond standard ad serving
```

### AdMob Policy Compliance
1. **Never click your own ads** — Google will detect and ban you
2. **Use test ad IDs in development** — always
3. **Don't force users to click ads** — don't make ads a gate
4. **Don't show ads on screens that violate policy** — no ads during "system" simulations (fake update should NOT have ads — looks deceptive)
5. **Frequency caps** — don't spam interstitials, 1 per 60s minimum

---

## Cost Summary

| Item | Cost |
|---|---|
| AdMob account | Free |
| AdMob SDK | Free (open source) |
| IAP via Apple | Apple takes 30% of each $1.99 sale ($0.60 to Apple, $1.39 to you) |
| App Store listing | Included in $99/year dev account |
| **Total monetization setup cost** | **$0** |