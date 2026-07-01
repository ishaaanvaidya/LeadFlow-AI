# Feature Lifecycle

Every feature follows the same order so agents do not jump directly into UI.

## Required Sequence
1. Read context, ADRs, architecture, domain model, engineering standards, and design docs.
2. Confirm product behavior and acceptance criteria.
3. Update documentation if the feature changes architecture or rules.
4. Define domain/data impact.
5. Define validation and API/action boundaries.
6. Implement data access and business logic.
7. Implement UI.
8. Add tests or verification.
9. Run self-review.
10. Fix issues before handoff.

## Handoff
Summaries must include changed files, behavior, verification, and known limits.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `templates/feature-template.md`
- `checklists/feature.md`

## Used By
- Planner skill
- All implementation tasks

## See Also
- `.mcp/skills/planner/SKILL.md`

## Implementation Notes
If a task skips documentation because no architecture changed, say that explicitly in the handoff.
