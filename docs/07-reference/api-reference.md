# API Reference

This reference records intended API surfaces before implementation stabilizes.

## Planned MVP Endpoints Or Actions
- Auth flows through Better Auth.
- Lead create/update/delete/move through Server Actions or protected Route Handlers.
- AI draft email through a protected server boundary.
- AI scoring through a protected server boundary.
- Dashboard DTO through server-side DAL.

## Response Convention
Use typed success/error results for expected failures. Use user-safe messages and stable error codes.

## Prerequisites
- `docs/02-architecture/api.md`

## Related Documents
- `templates/api-route-template.md`
- `templates/server-action-template.md`

## Used By
- Backend implementation
- Agent quick reference

## See Also
- `docs/02-architecture/error-handling.md`

## Implementation Notes
Update this reference when actual route names or action names are created.
