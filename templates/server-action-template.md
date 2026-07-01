# Server Action Template

## Purpose
Define a first-party mutation.

## Required Steps
1. Mark server action correctly.
2. Parse form or input.
3. Validate with Zod.
4. Resolve session.
5. Verify ownership.
6. Call DAL or service.
7. Revalidate or redirect.
8. Return typed result for expected errors.

## Prerequisites
- `docs/02-architecture/api.md`

## Related Documents
- `docs/02-architecture/error-handling.md`

## Used By
- Backend and frontend agents

## See Also
- `examples/good-server-action/README.md`

## Implementation Notes
Server Actions are public POST surfaces and must authorize internally.
