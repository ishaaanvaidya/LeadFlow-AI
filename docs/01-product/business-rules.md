# Business Rules

Business rules describe CRM behavior independent of UI framework details.

## Leads
- A Lead represents a potential business relationship.
- A Lead must belong to exactly one authenticated user in the MVP.
- A Lead should have a name and enough contact or company context to be useful.
- Stage must come from the allowed pipeline stages.
- Score must be Hot, Warm, Cold, or unknown before AI scoring.

## Pipeline
- Default stages are New, Contacted, Qualified, and Closed.
- Moving a lead between stages records an Activity.
- Closed leads should remain searchable and visible in reporting unless later archived.

## Activities
- Activities record important events: lead created, lead updated, stage changed, note added, AI draft generated, score updated.
- Activities should be append-only for auditability unless a future privacy rule requires deletion.

## AI
- AI suggestions are advisory.
- AI output must be validated before display or storage.
- Raw provider errors are never shown to users.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `docs/06-ai/lead-scoring.md`
- `docs/02-architecture/error-handling.md`

## Used By
- Domain services
- Tests
- Review checklists

## See Also
- `templates/feature-template.md`

## Implementation Notes
If a feature changes a business rule, update this document and consider whether an ADR is required.
