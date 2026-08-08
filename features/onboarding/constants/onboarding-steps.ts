export interface OnboardingStep {
  eyebrow: string
  title: string
  body: string
  icon: string
}

export const onboardingSteps: OnboardingStep[] = [
  {
    eyebrow: 'WELCOME',
    title: 'Welcome to PrankBox 🎁',
    body: '7+ pranks in one app. Shock your friends, crack their screens, detect ghosts, and more.',
    icon: '🎁',
  },
  {
    eyebrow: 'IMPORTANT',
    title: 'Keep it fun ⚠️',
    body: 'PrankBox is for ENTERTAINMENT PURPOSES ONLY. Everything is simulated. There are no real shocks, ghosts, calls, or system changes. Prank responsibly and never target vulnerable people.',
    icon: '⚠️',
  },
  {
    eyebrow: 'QUICK GUIDE',
    title: 'How to prank',
    body: '1. Pick a prank from the grid\n2. Set it up if needed\n3. Tap to activate\n4. Hand your phone to a friend\n5. Watch their reaction 😈',
    icon: '😈',
  },
]
