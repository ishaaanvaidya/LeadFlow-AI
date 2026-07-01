# Performance Architecture

LeadFlow AI should feel fast because CRM work is repetitive. Users should not wait for unnecessary JavaScript, uncached static assets, or unbounded database queries.

## Server Rendering
Use Server Components for data-heavy screens. Fetch data close to the database and send minimal DTOs to the client.

## Lists And Tables
- Paginate lead lists.
- Index common filters.
- Avoid loading all user records for table rendering.
- Consider virtualization only when page size and UX require it.

## Loading Strategy
- Use route skeletons for dashboard and list pages.
- Stream sections where useful.
- Keep AI panels independently loading so the rest of the page remains usable.

## Bundle Size
- Keep client boundaries small.
- Use dynamic imports for heavy interactive modules only when justified.
- Avoid adding libraries for simple UI.

## Memoization
Use memoization after measuring or when referential stability is required by a library. Do not scatter `useMemo` and `useCallback` by default.

## Prerequisites
- `docs/02-architecture/rendering.md`

## Related Documents
- `docs/04-engineering/react.md`
- `checklists/performance.md`

## Used By
- Frontend implementation
- Release review

## See Also
- `docs/08-deployment/monitoring.md`

## Implementation Notes
Performance work must preserve correctness and access control.
