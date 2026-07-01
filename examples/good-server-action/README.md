# Example: Good Server Action

## Example Purpose
Show a safe mutation flow.

## Pattern
Server Action receives form data, validates it, checks session, calls DAL, records activity, and returns or redirects.

## Good Qualities
- Progressive enhancement friendly.
- No client-trusted ownership.
- Validation precedes mutation.

## Prerequisites
- `templates/server-action-template.md`

## Related Documents
- `docs/02-architecture/error-handling.md`

## Used By
- Backend and frontend agents

## See Also
- `docs/04-engineering/nextjs.md`

## Implementation Notes
Server Actions require the same seriousness as API endpoints.
