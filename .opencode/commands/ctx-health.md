---
description: Checks session context health and recommends whether to continue, switch models, or start a new session.
agent: build
model: opencode/deepseek-v4-flash-free
---

Perform a quick context health self-check:

1. Estimate how much context has been used in this session (based on conversation length and tool calls made).
2. Determine the traffic light status: Green (0-40%), Yellow (40-70%), Orange (70-85%), Red (85%+).
3. Check if compaction has been triggered (look for signs of summarized context).
4. Report:
   - Current traffic light status
   - Approximate number of tool calls made this session
   - Whether any files were re-read unnecessarily
   - Recommendation: continue, be more concise, or start a new session
5. If recommending a new session, remind the user that all config/agents/skills auto-load in a new session.

Keep this response under 10 lines. This is a quick diagnostic, not a deep analysis. Use the free model to avoid wasting Go quota.