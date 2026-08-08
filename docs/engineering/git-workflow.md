# Git and Pull Request Workflow

## Branches

- `dev` is the integration branch.
- Use `feature/<short-purpose>` for feature work.
- Use `fix/<short-purpose>` for bug fixes.
- Start every branch from the latest `dev`.

## Commits

Use short Conventional Commit messages:

```text
feat: add prank catalog
fix: stop prank sound on exit
chore: update dependencies
```

Do not add AI attribution or `Co-authored-by` trailers.

## Pull Requests

- PR title matches the primary commit intent.
- Target `dev`.
- Keep the description short and state what changed and how it was validated.
- Add screenshots for visual changes when available.
- All type checks, lint checks, and formatting checks must pass.
- Merge only after review and a green validation result.
