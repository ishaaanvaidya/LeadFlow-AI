# Rendering Strategy

LeadFlow AI follows Next.js App Router rendering rules. Server Components are the default because CRM pages are data-heavy and benefit from server-side access control and smaller client bundles.

## Server Components
Use Server Components for layouts, pages, dashboards, detail shells, and data display that does not require browser state. Fetch DTOs from the DAL on the server.

## Client Components
Use Client Components for form interactivity, table controls, drag/drop pipeline movement, toasts, local UI state, copy-to-clipboard, and animations. Keep client boundaries small.

## Loading And Errors
Use route-level `loading.tsx` for skeletons and `error.tsx` for recoverable route failures. AI-specific failures should render inline states, not crash the route.

## Caching
Authenticated CRM data is request-specific and should not be globally cached without a clear strategy. Prefer correctness over aggressive caching.

## Prerequisites
- Next docs: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Related Documents
- `docs/02-architecture/security.md`
- `docs/02-architecture/performance.md`

## Used By
- Frontend implementation
- Performance review

## See Also
- `.mcp/skills/frontend/SKILL.md`

## Implementation Notes
A large `"use client"` page is a smell. Move interactivity into smaller leaf components.
