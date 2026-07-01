# Permissions

The MVP is single-user per account. Multi-user teams and RBAC are delayed, but the data model and access rules must not block adding teams later.

## MVP Authorization Rules
- A user can access only their own leads, notes, activities, AI conversations, and drafts.
- Every data query must be scoped by authenticated user identity.
- Route Handlers and Server Actions must verify session and ownership.
- Client-side route hiding is not authorization.

## Future Permission Direction
Future team support may add Owner, Admin, Manager, and Member roles. Do not hard-code assumptions that make a future `organizationId` impossible.

## Forbidden Patterns
- Querying by `id` without user ownership.
- Trusting user IDs from request bodies.
- Sending private data to Client Components when only display fields are needed.

## Prerequisites
- `docs/02-architecture/security.md`

## Related Documents
- `docs/03-adr/ADR-003-better-auth.md`
- `docs/03-adr/ADR-005-data-access-layer.md`

## Used By
- Backend features
- Data access helpers
- Security review

## See Also
- `checklists/security.md`

## Implementation Notes
Even though RBAC is delayed, owner isolation is mandatory from the first database query.
