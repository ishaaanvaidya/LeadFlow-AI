# Coding Standards

Code should be boring in the best way: explicit, typed, small, and easy to review.

## Standards
- Prefer clear names over comments.
- Keep components under 250 lines.
- Keep functions single-purpose.
- Use Zod at trust boundaries.
- Avoid duplicated business logic.
- Keep server-only code out of client bundles.
- Write accessible semantic markup.

## Anti-Patterns
- `any`
- Hidden authorization assumptions.
- Raw database objects in UI props.
- Global state for local state.
- Large Client Component pages.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `docs/04-engineering/typescript.md`
- `docs/04-engineering/react.md`

## Used By
- All code tasks

## See Also
- `checklists/review.md`

## Implementation Notes
When a shortcut feels necessary, document the reason in the implementation summary.
