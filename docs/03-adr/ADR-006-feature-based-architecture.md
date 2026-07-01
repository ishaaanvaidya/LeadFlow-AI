# ADR-006: Use Feature-Based Architecture

## Status
Accepted

## Decision
Feature code is organized by business capability, with shared primitives separated from business logic.

## Rationale
CRM modules such as leads, dashboard, pipeline, and AI workflows evolve independently. Feature folders reduce cross-module coupling and help agents find ownership boundaries.

## Consequences
- Feature-specific UI, schemas, actions, data helpers, and services live together.
- Shared UI primitives stay business-free.
- Cross-feature behavior must be extracted only when reuse is real.

## Prerequisites
- `docs/02-architecture/folder-structure.md`

## Related Documents
- `docs/04-engineering/feature-lifecycle.md`

## Used By
- All feature implementation

## See Also
- `templates/feature-template.md`

## Implementation Notes
Avoid creating generic abstractions before two real features need them.
