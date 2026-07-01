# ADR-005: Use A Server-Only Data Access Layer

## Status
Accepted

## Decision
All business data access goes through server-only DAL functions that enforce authentication, authorization, validation, and DTO shaping.

## Rationale
Next.js Server Components make it easy to access data directly from pages, but direct access can leak fields, duplicate authorization logic, and confuse client boundaries. A DAL keeps data rules auditable.

## Consequences
- DAL modules import `server-only` when implemented.
- Pages and actions request DTOs, not raw database rows.
- Ownership checks live near queries.
- Client Components receive minimal data.

## Prerequisites
- Next data security docs

## Related Documents
- `docs/02-architecture/security.md`
- `docs/02-architecture/database.md`

## Used By
- Backend agents
- Database agents

## See Also
- `.mcp/skills/backend/SKILL.md`

## Implementation Notes
If a page needs data, create or reuse a DAL reader instead of embedding Prisma calls in the page.
