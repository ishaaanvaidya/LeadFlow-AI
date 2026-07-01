# Project Principles

LeadFlow AI uses documentation-driven development. The point is not to create ceremony; it is to remove ambiguity so implementation agents can work with senior-level consistency.

## Principles
- Documentation comes before new architecture.
- ADRs record permanent decisions.
- `decisions/` records temporary or tactical decisions.
- Features start from product behavior, then domain model, then data access, then UI.
- AI assists the CRM; it does not own business truth.
- The database is the source of truth for business data.
- The browser is a rendering and interaction surface, not the permanent memory of the CRM.

## Anti-Patterns
- Building UI before the domain behavior is defined.
- Passing raw database rows into Client Components.
- Using AI output as trusted data without validation.
- Adding global state for local screen state.
- Creating tiny docs that duplicate each other.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `docs/04-engineering/feature-lifecycle.md`
- `docs/03-adr/ADR-005-data-access-layer.md`

## Used By
- All implementation agents
- Human reviewers

## See Also
- `checklists/feature.md`

## Implementation Notes
If a task requires a new pattern, document the recommendation and defer the decision unless the user explicitly approves it.
