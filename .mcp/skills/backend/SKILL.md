# Backend Skill

## Purpose
Implement server actions, route handlers, validation, business logic, and DAL calls safely.

## Required Reading
- `docs/02-architecture/api.md`
- `docs/02-architecture/security.md`
- `docs/02-architecture/error-handling.md`
- `docs/03-adr/ADR-005-data-access-layer.md`

## Rules
- Validate with Zod.
- Verify auth and ownership.
- Return safe DTOs.
- Map expected errors.

## Forbidden Shortcuts
- Trusting client IDs.
- Returning raw database objects.
- Leaking provider errors.

## Handoff Format
List server boundaries, schemas, auth checks, and error cases.

## Review Checklist
- Auth checked.
- Ownership scoped.
- Inputs validated.
- Errors safe.

## Acceptance Criteria
Server behavior is secure and predictable.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `templates/api-route-template.md`

## Used By
- Backend implementation

## See Also
- `examples/good-api/README.md`

## Implementation Notes
Server-side code should be boring and auditable.
