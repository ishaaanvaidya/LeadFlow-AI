# Testing Standards

Testing should match risk. Small UI-only changes need focused checks; shared data and auth behavior need stronger coverage.

## Test Targets
- Zod schemas validate accepted and rejected inputs.
- DAL functions enforce ownership.
- Server Actions and Route Handlers map errors safely.
- Critical forms submit and display validation.
- Dashboard metrics match seeded data.

## Manual Verification
Until automated coverage is mature, every feature should include manual verification notes covering desktop, mobile, dark mode, keyboard flow, and error states.

## Prerequisites
- `docs/04-engineering/definition-of-done.md`

## Related Documents
- `checklists/feature.md`
- `templates/test-template.md`

## Used By
- Testing agents
- Reviewers

## See Also
- `.mcp/skills/testing/SKILL.md`

## Implementation Notes
Do not mark a feature complete because the happy path works once.
