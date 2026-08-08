---
name: session-management
description: Use when deciding whether to start a new session, switch models, or check context health. Triggers on "new session", "context full", "running out of context", "switch model", "session health".
---

# Session Management Skill

This skill helps manage context health, prevent degradation, and optimize token spending.

## Context Traffic Light System

| Light | Context Used | Action |
|---|---|---|
| 🟢 Green | 0-40% | Normal work. Default model. Full speed. |
| 🟡 Yellow | 40-70% | Be extra concise. Don't re-read files. Use subagents for searches. |
| 🟠 Orange | 70-85% | Wrap up current task only. Don't start new sub-tasks. Suggest new session to user. |
| 🔴 Red | 85%+ | Stop. Tell user to start a new session. Compaction will trigger but quality drops. |

## When to Start a New Session

### Mandatory New Session

1. **After completing a full feature** — e.g., one prank screen is fully done and tested
2. **Switching task categories** — coding → debugging, or building → deploying
3. **After compaction has triggered** — the session context was summarized, quality is degraded
4. **Before starting a new prank** — each prank should get a fresh session to avoid cross-contamination

### Optional New Session

1. **After 15+ tool calls in one session** — context is likely bloated
2. **When switching to a different part of the codebase** — e.g., from stores/ to components/
3. **When the user asks an unrelated question** — don't pollute the coding session

### When NOT to Start a New Session

1. **Mid-task** — if you're in the middle of implementing something, finish it first
2. **During a debugging session** — you need the error context to fix the bug
3. **Quick follow-up** — if the user asks a small follow-up about the current task

## Model Switching Strategy

### Default Routing (no action needed)

| Task | Model | Cost |
|---|---|---|
| Coding (build agent) | `opencode-go/gpt-5.6-luna` | Included in Go $10/mo |
| Planning (plan agent) | `opencode-go/glm-5.2` | Included in Go |
| Titles, summaries, compaction | `opencode/deepseek-v4-flash-free` | Free |

### Manual Switch (user runs `/models` in TUI)

| Situation | Switch To | Why |
|---|---|---|
| Quick typo fix or 1-line edit | `opencode/deepseek-v4-flash-free` | Free, no need to use Go quota |
| Complex architecture decision | `opencode-go/glm-5.2` | Better reasoning |
| Stuck on bug 3+ attempts | `opencode/claude-sonnet-5` | Strongest coding model, but pay per token |
| Context nearly full | Start new session instead | Don't waste tokens on a degraded session |

## Cost-Saving Habits

1. **Use free models for trivia** — session titles, summaries, compaction are already routed to free models.
2. **Don't read large files fully** — use `grep` to find the relevant section, then `read` with `offset` and `limit`.
3. **Batch tool calls** — read 3 files in one message, not 3 separate messages.
4. **Don't ask "did you read AGENTS.md?"** — it's in `instructions`, it's always loaded.
5. **Use subagents for exploration** — `Task` tool with `explore` agent keeps the main context clean.
6. **Stop early** — if a task is done, stop. Don't add unsolicited explanations or summaries.

## Signs of Context Degradation (Self-Check)

If you notice any of these, suggest a new session to the user:

- [ ] You can't remember what file you just edited
- [ ] You're re-reading AGENTS.md (it's always loaded — if you feel the need, context is degraded)
- [ ] You're repeating the same search you did earlier
- [ ] Your responses are getting longer and less precise
- [ ] You're suggesting changes that conflict with conventions you were told earlier
- [ ] You forgot the user's original request

## Commit Checkpoint Pattern

Before ending a session, ensure:

1. All changes are saved (no uncommitted work that would be lost)
2. Run `npx tsc --noEmit` — zero errors
3. Tell the user: "Session is healthy / needs rotation" so they can decide
4. If starting a new session, the user just opens a new opencode session in the same directory — all config, agents, and skills are automatically loaded

## 5-Hour Window Integration

The Go plan has a $12 budget per 5-hour rolling window. Each session consumes from this window AND from the monthly $60 budget.

### Session Planning with Windows

| Window State | Session Strategy |
|---|---|
| Fresh window ($0-2 spent) | Start a heavy coding session. Use GPT 5.6 Luna. |
| Mid window ($2-7 spent) | Continue coding but be efficient. Avoid expensive models. |
| Late window ($7-10 spent) | Start a lightweight session using free models only. |
| Depleted ($10+ spent) | Wait for reset. Do NOT start a new paid session. Check back in 1-2 hours. |

### Aligning Sessions with Windows

1. **One major coding session per 5-hour window** — do heavy work at the start of a window
2. **Use free models between windows** — for simple tasks while waiting for reset
3. **Plan window timing** — if you know you'll code at 2pm, check that the window isn't already depleted from morning work
4. **Each session = one prank or one feature** — this naturally aligns with the 5-hour window cadence

### How to Check Window Status

Run `/budget` in the TUI. The agent will report:
- 5-hour window: $X of $12 remaining
- Weekly: $X of $30 remaining
- Monthly: $X of $60 remaining
- Recommend whether to proceed, wait, or use free models