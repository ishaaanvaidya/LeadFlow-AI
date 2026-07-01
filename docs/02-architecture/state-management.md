# State Management

State should live as close as possible to the source of truth.

## Server State
CRM records live in the database and are read through the DAL. Server Components should receive safe DTOs.

## Form State
Use native forms and Server Actions for simple mutations. Use React Hook Form when the form is complex, needs rich validation feedback, or has interactive client behavior.

## Client UI State
Use component state for local controls. Use Zustand only for cross-route UI state such as sidebar collapse or command palette state.

## Query State
Use TanStack Query when client-side fetching, retries, invalidation, or optimistic updates are clearly needed. Do not wrap every server-rendered page in client fetching.

## Prerequisites
- `docs/02-architecture/rendering.md`

## Related Documents
- `docs/04-engineering/react.md`
- `docs/02-architecture/api.md`

## Used By
- Frontend agents
- Reviewers

## See Also
- `examples/good-form/README.md`

## Implementation Notes
If state must survive refresh, it probably belongs in the database, not Zustand.
