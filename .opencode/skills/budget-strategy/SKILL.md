---
name: budget-strategy
description: Use when the user asks about spending, budget, cost optimization, or Go plan limits. Triggers on "budget", "cost", "how much", "spending", "limit", "quota", "window reset".
---

# Budget Strategy Skill

## Go Plan Structure ($10/month)

The user pays $10/month but receives $60 of usage value (6x multiplier).

| Window | Budget | Resets |
|---|---|---|
| 5-hour | $12 | Rolling 5 hours |
| Weekly | $30 | Every 7 days |
| Monthly | $60 | Every billing month |

All three limits are enforced simultaneously. The most restrictive one blocks requests.

## Understanding Usage Display

When the TUI shows:
- "42% used" → This is the **context window** percentage of the current session, NOT budget
- "$2.63 spent" → This is deducted from the $60 monthly budget, NOT the $10 payment
- "84,899 tokens" → Total tokens consumed in this session

The user's $10 payment is the subscription fee. The $60 is the usage value. Never confuse the two.

## Model Selection by Budget State

### Fresh 5-Hour Window ($0-2.40 spent, 0-20% used)

Use expensive models freely:
- GPT 5.6 Luna for coding (primary)
- GLM-5.2 for planning (1-2 requests max)
- DeepSeek V4 Flash for heavy tasks

### Mid Window ($2.40-7.20 spent, 20-60% used)

Be selective:
- GPT 5.6 Luna for coding only
- Switch to DeepSeek V4 Flash for simpler tasks
- Do NOT use GLM-5.2 or Grok 4.5 unless critical

### Late Window ($7.20-10.20 spent, 60-85% used)

Conservation mode:
- DeepSeek V4 Flash only (cheapest Go model, ~$0.28/1M output)
- Free models for trivial tasks
- Avoid all expensive models

### Depleted Window ($10.20+ spent, 85%+ used)

Emergency only:
- Free models only (deepseek-v4-flash-free, mimo-v2.5-free)
- Wait for window to reset in 1-2 hours
- Or use Zen balance if Go limit is hit

## Model Cost Comparison (per 1M output tokens)

| Model | Cost | Cheaper Than Luna By | Use Case |
|---|---|---|---|
| DeepSeek V4 Flash | $0.28 | 4.3x cheaper | Heavy coding, long sessions |
| MiMo-V2.5 | $0.28 | 4.3x cheaper | Backup for Flash |
| GPT 5.6 Luna | $1.20 | — (baseline) | Primary coding model |
| Qwen3.7 Plus | $1.60 | 0.75x (more expensive) | Alternative coding |
| MiniMax M3 | $1.20 | Same | Alternative |
| Kimi K2.7 Code | $4.00 | 3.3x more expensive | Strong code reasoning |
| GLM-5.2 | $4.40 | 3.7x more expensive | Planning only |
| Grok 4.5 | $6.00 | 5x more expensive | Rare, specific needs |
| Kimi K3 | $15.00 | 12.5x more expensive | Avoid |

## Free Models (Zen, $0 cost, do NOT consume Go budget)

| Model | Best For |
|---|---|
| deepseek-v4-flash-free | Simple edits, code reading, refactors |
| mimo-v2.5-free | Simple tasks |
| Other free Zen models | Experimentation |

Free models may use your data for training during the free period. Do not send sensitive data.

## Daily Allocation Recommendation

$30/week ÷ 7 days = ~$4.28/day optimal spend.

| Activity | Daily Cost | Model |
|---|---|---|
| 1 main coding session (1-2 hrs) | $2-3 | GPT 5.6 Luna |
| 1 planning request | $0.50 | GLM-5.2 |
| Simple edits, typo fixes | $0 | Free models |
| **Total** | **$2.50-3.50/day** | Under $4.28/day target |

## When to Use Zen (Pay-Per-Token) Instead of Go

Use Zen ($20 pay-as-you-go balance) ONLY when:
1. Go monthly limit ($60) is fully consumed
2. You need Claude Sonnet 5 ($2/$10 per 1M) for a critical bug
3. You need GPT 5.5 or Claude Opus for a hard problem

Normal development should NEVER touch Zen. Go covers everything.

## How to Check Current Budget

1. Run `/budget` command in OpenCode TUI
2. Or check the console at opencode.ai/auth
3. The TUI shows real-time usage in the status bar

## Budget Conservation Tips for the Agent

1. Never use expensive models (Kimi K3, Grok 4.5, GLM-5.2) for simple tasks
2. Use free models for: code reading, simple refactors, understanding existing code
3. Keep responses short — fewer output tokens = less money
4. Don't re-read files — each read costs tokens
5. Batch tool calls to avoid repeated context overhead
6. Use the `explore` subagent (free model) for codebase searches
7. If the user's 5hr window is depleted, suggest waiting for reset or using free models