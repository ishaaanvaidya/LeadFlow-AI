# Acceptance Criteria

The MVP is complete only when the following outcomes are verifiable in a live demo environment.

## Authentication
- A user can sign up with email and password.
- A user can log in and log out.
- Protected CRM pages reject unauthenticated access.

## CRM Core
- A lead can be created, viewed, edited, and deleted or archived according to the implemented policy.
- Leads appear in table and pipeline views.
- Search returns relevant results as the user types or submits.
- Filters work for stage, source, score, and date where implemented.
- Lead detail shows current fields and activity history.

## AI
- Draft email returns coherent text within the target response window or shows a friendly error.
- Regeneration supports tone where implemented.
- Lead score appears as Hot, Warm, or Cold with a short explanation.
- Insights panel shows actionable next steps or a graceful unavailable state.

## Quality
- Dashboard metrics match stored data.
- Mobile layout works at 375px width.
- TypeScript, lint, and relevant tests pass.
- No raw API errors or secrets appear in the UI.

## Prerequisites
- `docs/01-product/PRD.md`

## Related Documents
- `docs/04-engineering/definition-of-done.md`
- `checklists/release.md`

## Used By
- QA
- Release review
- Demo readiness

## See Also
- `docs/08-deployment/production-checklist.md`

## Implementation Notes
Acceptance criteria are user-visible outcomes; implementation details belong in architecture and engineering docs.
