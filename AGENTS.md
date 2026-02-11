# AGENTS.md

## Change Scope
- Always keep PRs small and focused (one concern per PR).

## Required Checks Before Finishing
Run the following commands before finishing work:
- `pnpm -s check`
- `pnpm -s test`
- `pnpm -s build`

## API Contract Changes
- Do not change API contracts unless tests and docs are also updated.

## Content Security Policy
- Never add `unsafe-eval` to CSP for production.

## Stripe Webhook Handling
- Stripe webhook endpoints must use the raw request body.
- Stripe webhook routes must not pass through `express.json()`.

## Pull Request Description
Every PR description should clearly include:
- What changed
- Why it changed
- How to verify it
