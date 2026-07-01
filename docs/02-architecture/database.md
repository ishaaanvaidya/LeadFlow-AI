# Database Architecture

The database is the CRM's memory. If it disappears, user accounts, leads, pipeline state, activity history, AI drafts, and dashboard metrics disappear.

## Strategy
Use Prisma with SQLite for local MVP development. Keep schema and query patterns compatible with PostgreSQL so production migration is straightforward.

## Modeling Rules
- Every user-owned table includes `userId` or reaches ownership through a required relation.
- Use timestamps for created and updated records.
- Use enums for controlled states such as pipeline stage and lead score.
- Add indexes for user-scoped lookup, search/filter fields, and stage dashboards.
- Prefer soft archive over destructive delete when business history matters.

## Query Rules
- Queries go through DAL functions.
- DAL returns DTOs, not raw Prisma models.
- Include ownership in the query predicate.
- Use pagination for lists.

## Migration Rules
Schema changes require:
- Domain model review.
- Prisma migration.
- Seed update if demo data is affected.
- Tests or manual verification.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `docs/03-adr/ADR-002-prisma-sqlite-to-postgres.md`
- `docs/03-adr/ADR-005-data-access-layer.md`

## Used By
- Database agents
- Backend agents

## See Also
- `templates/prisma-model-template.md`

## Implementation Notes
Do not design database tables directly from UI screens. Design from domain concepts and workflows.
