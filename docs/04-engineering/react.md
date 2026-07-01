# React Standards

React code in LeadFlow AI should support Server Components first and interactive leaf components second.

## Component Rules
- Server Components compose data and layout.
- Client Components own interaction.
- Pass narrow props.
- Use composition over prop drilling.
- Keep reusable primitives free of CRM business rules.

## Hooks
Use hooks in Client Components only. Custom hooks should hide reusable client behavior, not server data access.

## State
Use local state first. Use Zustand for app-level client state. Use TanStack Query only when client-side server state orchestration is justified.

## Prerequisites
- `docs/02-architecture/rendering.md`

## Related Documents
- `docs/02-architecture/state-management.md`

## Used By
- Frontend agents

## See Also
- `examples/good-component/README.md`

## Implementation Notes
Do not add memoization until a library contract or measurement justifies it.
