# Error Handling

Errors should be predictable, safe, and useful. Users need recovery options; developers need enough context to debug.

## Error Classes
- Expected validation errors: show field-level or inline messages.
- Expected business errors: show user-safe messages such as missing permission or lead not found.
- AI provider errors: show an unavailable state with retry where appropriate.
- Unexpected errors: log server-side and show a generic fallback.

## UI Surfaces
- Forms show field errors and submit-level errors.
- Tables show empty, loading, and failed states.
- Detail pages use route error boundaries for unrecoverable failures.
- AI panels fail inline so the CRM remains usable.
- Toasts are for transient confirmation, not primary error explanation.

## Server Rules
- Do not throw raw provider or database errors into UI.
- Use stable error codes for client handling.
- Log enough context without leaking secrets.

## Prerequisites
- `docs/02-architecture/api.md`

## Related Documents
- `docs/06-ai/safety-and-errors.md`
- `docs/04-engineering/logging.md`

## Used By
- Backend agents
- Frontend agents
- Reviewers

## See Also
- `checklists/review.md`

## Implementation Notes
Error handling is part of the feature, not polish after the feature.
