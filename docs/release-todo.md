# Release TODO

These placeholders are intentional for development. Do not run a production store build until every item below is complete.

- [ ] Create Apple Developer and Google Play Console accounts.
- [ ] Create the iOS App Store and Android Play Store app records.
- [ ] Replace the placeholder iOS and Android AdMob app IDs in `app.json`.
- [ ] Replace the placeholder banner and interstitial unit IDs in `features/monetization/constants/ad-config.ts`.
- [ ] Create the non-consumable `$1.99` product on both stores and replace `MONETIZATION_CONFIG.productId`.
- [ ] Publish Privacy Policy and Terms of Use URLs and add them to the store listings.
- [ ] Create `assets/images/icon.png` and verify the splash screen on both platforms.
- [ ] Configure EAS credentials without committing private keys or service-account files.
- [ ] Run `npm run release:check` with production values.
- [ ] Build preview versions and test on physical iOS and Android devices.
- [ ] Complete store screenshots, content ratings, privacy labels, and Data Safety forms.
- [ ] Submit production builds only after consent, ads, IAP, audio, and exit behavior pass device testing.
