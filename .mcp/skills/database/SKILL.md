# Database Skill

## Purpose
Design Prisma models, migrations, seeds, indexes, and data access around the domain model.

## Required Reading
- `docs/02-architecture/domain-model.md`
- `docs/02-architecture/database.md`
- `docs/03-adr/ADR-002-prisma-sqlite-to-postgres.md`

## Rules
- Scope user-owned records.
- Keep PostgreSQL migration path clean.
- Add indexes for common queries.
- Record activity for meaningful changes.

## Forbidden Shortcuts
- Schema from UI alone.
- Unbounded list queries.
- Ownership-free queries.

## Handoff Format
List model changes, migration impact, seed changes, indexes, and data risks.

## Review Checklist
- Ownership modeled.
- Relationships clear.
- Query paths considered.

## Acceptance Criteria
Data model supports MVP and future migration.

## Prerequisites
- `docs/01-product/business-rules.md`

## Related Documents
- `templates/prisma-model-template.md`

## Used By
- Database implementation

## See Also
- `docs/07-reference/glossary.md`

## Implementation Notes
Model business truth, not screen layout.
