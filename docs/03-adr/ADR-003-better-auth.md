# ADR-003: Use Better Auth

## Status
Accepted

## Decision
Use Better Auth for authentication instead of the BRD's older NextAuth assumption.

## Rationale
The current project rules already selected Better Auth. It fits modern TypeScript apps, supports session handling, and avoids locking the project to stale BRD technology.

## Consequences
- Auth helpers must be centralized.
- Protected routes, Server Actions, Route Handlers, and DAL functions must use shared session utilities.
- Password and session security are delegated to the auth layer but still reviewed at integration boundaries.

## Prerequisites
- `docs/01-product/permissions.md`

## Related Documents
- `docs/02-architecture/security.md`
- `docs/04-engineering/environment.md`

## Used By
- Authentication implementation
- Security review

## See Also
- `checklists/security.md`

## Implementation Notes
Do not implement custom password/session logic unless Better Auth cannot satisfy a documented requirement.
