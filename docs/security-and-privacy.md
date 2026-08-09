# Security and Privacy Guardrails

## Data boundary

PrankBox must not collect, transmit, or persist names, phone numbers, contacts, photos, location, microphone recordings, or prank results. Fake-call fields are display-only and must never leave the device.

The ad and purchase SDKs are the only network-capable integrations. Their collection and processing must be disclosed in the store privacy labels and privacy policy. Do not add analytics, remote config, authentication, or a backend without a documented privacy and threat-model review.

## Entitlements

Premium state is an in-memory cache, never an authorization source. Startup and restore flows must ask the platform purchase API for the entitlement. Product IDs and ad unit IDs are identifiers, not secrets; private credentials, signing keys, receipts, and service credentials must never be bundled in the app.

## Release gates

Run `npm run release:check` before a production build. It must fail when placeholder product or ad identifiers remain. Production ad identifiers must be registered values, while development builds must use Google test IDs.

## Prank safety

Every prank must show the entertainment disclaimer. Any system-like presentation must show a persistent, high-contrast `PRANK` indicator and an always-available exit control. Never request permissions that are not required by the feature, and always stop timers, haptics, animations, and audio on exit or unmount.

## Future changes

Treat all persisted values as untrusted input. Validate external SDK results by product ID, avoid logging SDK payloads, keep error messages generic, and review every new dependency for permissions, network access, and data collection before installation.
