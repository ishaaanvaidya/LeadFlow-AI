# Next.js Standards

This project uses Next.js `16.2.9`. Agents must read bundled docs under `node_modules/next/dist/docs/` for relevant framework work.

## Rules
- App Router only.
- Route Handlers only inside `app/api`.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` intentionally.
- Keep Server Actions authenticated and validated.
- Do not mix Pages Router conventions.

## Data
Use DAL functions from server code. Do not call Prisma from Client Components. Avoid global caching for authenticated CRM data unless documented.

## Prerequisites
- `docs/03-adr/ADR-001-nextjs-app-router.md`

## Related Documents
- `docs/02-architecture/api.md`
- `docs/02-architecture/rendering.md`

## Used By
- Next.js implementation

## See Also
- `node_modules/next/dist/docs/01-app/02-guides/ai-agents.md`

## Implementation Notes
When Next docs contradict memory, trust the installed docs.
