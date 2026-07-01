# Decision: Use SQLite First

## Decision
Use SQLite during local MVP development, with Prisma preserving a path to PostgreSQL.

## Reason
The project needs low-friction local setup before production deployment concerns.

## Revisit When
Deploying persistent demo data or adding team workflows.

## Prerequisites
- `docs/03-adr/ADR-002-prisma-sqlite-to-postgres.md`

## Related Documents
- `docs/02-architecture/database.md`

## Used By
- Database setup

## See Also
- `docs/08-deployment/deployment.md`

## Implementation Notes
This lightweight decision supports the ADR and can be superseded by migration work.
