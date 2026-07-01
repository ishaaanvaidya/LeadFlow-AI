# Definition Of Done

A task is done when implementation, verification, and documentation are all complete for the scope.

## Required
- Relevant docs were read.
- Architecture rules were followed.
- TypeScript passes.
- ESLint passes.
- Relevant tests or manual checks are complete.
- UI is responsive and accessible when UI changes.
- Dark mode is considered when UI changes.
- Errors are safe and recoverable where possible.
- Security boundaries are verified.
- No forbidden shortcuts remain.

## Not Done
- Happy path only.
- UI without error states.
- Data access without ownership checks.
- AI integration without graceful failure.
- New pattern without documentation or a recommendation section.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `checklists/feature.md`
- `checklists/review.md`

## Used By
- All agents

## See Also
- `docs/04-engineering/feature-lifecycle.md`

## Implementation Notes
If verification cannot run, explain why and list the residual risk.
