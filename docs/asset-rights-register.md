# Asset Rights Register

Every shipped asset must have a specific source and commercial-use record. A platform-wide license summary is not sufficient evidence for an individual downloaded asset.

## Sounds

| File | Source URL | Creator | License | Download date | Attribution | SHA-256 | Status |
|---|---|---|---|---|---|---|---|
| `assets/sounds/electric-buzz.mp3` | TODO | TODO | TODO | TODO | TODO | `1B41EC99C2791EB1D292E0F1B09355A3CF0C184DB42458D34CD041E249951E4B` | UNVERIFIED — do not ship |
| `assets/sounds/glass-crack.mp3` | TODO | TODO | TODO | TODO | TODO | `BC75805C806A248D44A6DEE68B39F97991A532D2762AF46FB8CF07F48F716A39` | UNVERIFIED — do not ship |
| `assets/sounds/phone-ring.mp3` | TODO | TODO | TODO | TODO | TODO | `DB7D1A074A3B7D758D40C67D02F75FB4BB1B071E6A80161B3FBA330EE2DDDF32` | UNVERIFIED — do not ship |
| `assets/sounds/clipper-buzz.mp3` | TODO | TODO | TODO | TODO | TODO | `1B41EC99C2791EB1D292E0F1B09355A3CF0C184DB42458D34CD041E249951E4B` | UNVERIFIED — do not ship |
| `assets/sounds/ghost-ambient.mp3` | TODO | TODO | TODO | TODO | TODO | `1B41EC99C2791EB1D292E0F1B09355A3CF0C184DB42458D34CD041E249951E4B` | UNVERIFIED — do not ship |
| `assets/sounds/scream.mp3` | TODO | TODO | TODO | TODO | TODO | `1B41EC99C2791EB1D292E0F1B09355A3CF0C184DB42458D34CD041E249951E4B` | UNVERIFIED — do not ship |

## App icon

| File | Source/project file | Creator | License | Commercial-use proof | Status |
|---|---|---|---|---|---|
| `assets/images/icon.png` | TODO | TODO | TODO | TODO | Create and verify |

## Bundled packages

| Package/assets | Source URL | Creator | License | Attribution | Status |
|---|---|---|---|---|---|
| `@expo-google-fonts/inter` | https://fonts.google.com/specimen/Inter | Google; Rasmus Andersson | SIL Open Font License 1.1 | Preserve the package license notice | Verify package notice before submission |
| `@expo-google-fonts/space-mono` | https://fonts.google.com/specimen/Space+Mono | Google; Colophon Foundry | SIL Open Font License 1.1 | Preserve the package license notice | Verify package notice before submission |
| `@expo/vector-icons` Ionicons | https://github.com/oblador/react-native-vector-icons | Ionic; react-native-vector-icons contributors | MIT | Preserve the package license notice | Verify package notice before submission |

## Audit notes

- SHA-256 values were recorded from the files currently in the worktree on 2026-08-09.
- Four sound files currently share the same SHA-256 value; this requires source verification or replacement before release.
- A hash proves file identity, not ownership or commercial-use permission. Every `TODO` and `UNVERIFIED` entry remains a release blocker.

## Rules

- Do not ship an asset marked `TODO`, `Replace or verify`, or `Create and verify`.
- Keep the original source/project file and license evidence outside the app bundle when appropriate, while retaining this register in the repository.
- Recheck licenses when an asset is edited, remixed, regenerated, or replaced.
