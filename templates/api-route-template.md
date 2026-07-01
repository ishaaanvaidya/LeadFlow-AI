# API Route Template

## Purpose
Define a protected Route Handler under `app/api/**/route.ts`.

## Required Shape
- Validate method.
- Resolve session.
- Validate body or params with Zod.
- Verify ownership.
- Call service or DAL.
- Return typed JSON.
- Map errors safely.

## Example Steps
1. Import schema.
2. Parse request.
3. Check auth.
4. Execute use case.
5. Return `Response.json`.

## Prerequisites
- `docs/02-architecture/api.md`

## Related Documents
- `docs/02-architecture/security.md`

## Used By
- Backend agents

## See Also
- `examples/good-api/README.md`

## Implementation Notes
Route Handlers are not shortcuts around the DAL.
