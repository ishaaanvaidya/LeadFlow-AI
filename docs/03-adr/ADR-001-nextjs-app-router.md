# ADR-001: Use Next.js App Router

## Status
Accepted

## Decision
LeadFlow AI uses Next.js App Router only. Pages Router is not allowed.

## Rationale
The installed project is Next.js `16.2.9`, and App Router is the correct foundation for Server Components, layouts, route handlers, server actions, streaming, and version-matched agent documentation. Mixing routers increases complexity and confuses agents.

## Consequences
- Routes live under `src/app/`.
- APIs use Route Handlers under `app/api`.
- Server Components are the default rendering model.
- Agents must read bundled Next docs before Next-specific changes.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `docs/02-architecture/rendering.md`
- `docs/04-engineering/nextjs.md`

## Used By
- Frontend agents
- Backend agents

## See Also
- `node_modules/next/dist/docs/01-app/`

## Implementation Notes
If a library guide assumes Pages Router, translate the pattern to App Router or defer with a recommendation.
