# Example: Contact Feature

## Example Purpose
This example shows how a future contact module should be described before implementation.

## Canonical Shape
- Product behavior: user can view people related to leads and companies.
- Domain impact: `Contact` is distinct from `Lead`.
- Data access: server-only readers and mutations scoped by user.
- UI: table, detail panel, and lead relationship display.
- Testing: ownership, validation, empty state, and search.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `templates/feature-template.md`

## Used By
- Planner agents

## See Also
- `docs/01-product/workflows.md`

## Implementation Notes
This is a canonical example, not wired application code.
