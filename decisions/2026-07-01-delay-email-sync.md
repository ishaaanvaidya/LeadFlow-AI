# Decision: Delay Email Sync

## Decision
Delay SMTP, Gmail, and email sending integrations until after MVP.

## Reason
The MVP requires AI drafting and copy support, not sending. Sending introduces deliverability, OAuth, audit, and compliance complexity.

## Revisit When
Draft quality and CRM core workflows are stable.

## Prerequisites
- `docs/06-ai/email-drafting.md`

## Related Documents
- `docs/01-product/PRD.md`

## Used By
- AI feature planning

## See Also
- `.context/future-features.md`

## Implementation Notes
UI must not imply that LeadFlow sends email during MVP.
