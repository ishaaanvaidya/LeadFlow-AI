# ADR-004: AI Is An Enhancement, Not A Dependency

## Status
Accepted

## Decision
LeadFlow AI must remain a functional CRM when AI providers are unavailable.

## Rationale
The core business value of a CRM is trusted relationship memory. AI improves speed and quality, but provider latency, cost, and failures cannot block lead management.

## Consequences
- Lead CRUD, pipeline, activity log, dashboard, search, and filters work without AI.
- AI features show isolated loading and error states.
- AI output is suggestion, not authority.
- AI provider integration stays behind an adapter.

## Prerequisites
- `docs/06-ai/ai-architecture.md`

## Related Documents
- `docs/02-architecture/error-handling.md`
- `docs/06-ai/safety-and-errors.md`

## Used By
- AI agents
- Product reviewers

## See Also
- `checklists/review.md`

## Implementation Notes
Never make page rendering depend on an AI call unless an explicit feature spec requires it.
