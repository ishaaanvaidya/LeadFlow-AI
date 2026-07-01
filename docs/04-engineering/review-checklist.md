# Review Checklist

Every meaningful change should be reviewed across architecture, behavior, security, accessibility, performance, and maintainability.

## Review Areas
- Architecture follows docs and ADRs.
- Data access is authenticated and scoped.
- Inputs are validated.
- Types avoid `any`.
- UI is responsive, accessible, and dark-mode aware.
- Errors are friendly and logged safely.
- AI failures do not break CRM workflows.
- Tests or manual verification match risk.

## Reviewer Questions
- Does this change introduce a new pattern?
- Is the pattern documented?
- Is business data protected?
- Would a user understand the empty, loading, success, and error states?

## Prerequisites
- `docs/04-engineering/definition-of-done.md`

## Related Documents
- `checklists/review.md`
- `checklists/security.md`

## Used By
- Review skill
- Human reviewers

## See Also
- `.mcp/skills/review/SKILL.md`

## Implementation Notes
Review findings should prioritize real risks over style preferences.
