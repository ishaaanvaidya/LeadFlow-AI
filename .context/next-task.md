# Next Task

The next logical task is live manual QA and demo hardening.

## Recommended Next Step
Run the app against a seeded database and verify:
- Sign up, sign in, and sign out.
- Create/edit/archive lead, company, contact, deal, task, meeting, and note.
- Pipeline drag/drop logs activity.
- Global search and Ctrl+K command palette work.
- Dashboard metrics match seeded data.
- AI draft, score, and insights gracefully fall back if `NVIDIA_API_KEY` is unavailable.
- Mobile width around 375px remains usable.

## Prerequisites
- `.context/current-phase.md`
- `docs/04-engineering/definition-of-done.md`

## Related Documents
- `checklists/review.md`
- `checklists/security.md`
- `checklists/ui.md`

## Used By
- Planner agents

## See Also
- `templates/feature-template.md`

## Implementation Notes
No new architecture decision is required for QA-only fixes. Data-provider architecture should be reviewed separately because existing code uses PostgreSQL while older architecture docs mention SQLite-first.
