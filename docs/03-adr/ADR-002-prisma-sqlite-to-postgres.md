# ADR-002: Use Prisma With SQLite First And PostgreSQL Later

## Status
Accepted

## Decision
Use Prisma as the ORM. Use SQLite for local MVP development and keep the schema portable to PostgreSQL for production maturity.

## Rationale
SQLite reduces setup friction for a single-developer portfolio MVP. Prisma provides schema clarity and migration discipline. PostgreSQL is the likely managed database for a SaaS demo once deployment stabilizes.

## Consequences
- Avoid database features that make migration unnecessarily hard.
- Add indexes and ownership constraints early.
- Keep seed data realistic.
- Treat migrations as part of feature delivery.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `docs/02-architecture/database.md`

## Used By
- Database agents
- Backend agents

## See Also
- `templates/prisma-model-template.md`

## Implementation Notes
Database provider changes require a new ADR or an amendment decision.
