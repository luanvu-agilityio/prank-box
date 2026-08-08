---
description: Checks Go plan budget status — 5hr window, weekly, and monthly remaining. Recommends whether to proceed or wait.
agent: build
model: opencode/deepseek-v4-flash-free
---

Perform a quick Go plan budget check:

1. Review the usage tracking info available in the current session context (token counts, money spent indicators).
2. Estimate where we are in the 5-hour window:
   - Fresh: $0-2.40 spent (0-20%)
   - Mid: $2.40-7.20 spent (20-60%)
   - Late: $7.20-10.20 spent (60-85%)
   - Depleted: $10.20+ spent (85%+)
3. Report in this format:

```
--- Go Plan Budget Check ---
5-Hour Window: [Fresh/Mid/Late/Depleted] — estimated ~$X of $12 remaining
Weekly: ~$X of $30 remaining (if estimable)
Monthly: ~$X of $60 remaining (if estimable)
Recommendation: [Continue with GPT 5.6 Luna / Switch to DeepSeek V4 Flash / Use free models only / Wait for window reset]
Note: Check opencode.ai/auth for exact numbers.
---
```

4. If the window appears depleted, suggest:
   - Using free models (deepseek-v4-flash-free) for simple tasks
   - Waiting 1-2 hours for the 5-hour window to reset
   - Checking the console at opencode.ai/auth for exact usage

5. Keep response under 15 lines. Use the free model to avoid consuming Go quota for this diagnostic.