# Folder Structure

Use feature-based organization with App Router conventions.

## Target Structure
```txt
src/
  app/
  components/
    ui/
  features/
    leads/
      components/
      actions/
      data/
      schemas/
      services/
      types/
  hooks/
  lib/
    auth/
    db/
    ai/
    errors/
  services/
  store/
  styles/
  types/
  utils/
  config/
```

## Rules
- `app/` exposes routes and route-level composition.
- Feature folders own business UI and behavior.
- `components/ui/` contains reusable presentation primitives only.
- `lib/` contains shared server-safe infrastructure.
- `utils/` contains pure helpers with no React and no database access.
- `store/` is for global client state only.

## File Naming
- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Utilities: `camelCase.ts`
- Schemas: `feature.schema.ts`
- Server actions: `feature.actions.ts`
- DAL files: `feature.data.ts`

## Prerequisites
- `docs/02-architecture/architecture.md`

## Related Documents
- `docs/04-engineering/coding-standards.md`
- `docs/04-engineering/feature-lifecycle.md`

## Used By
- Code generation
- Reviews

## See Also
- `docs/07-reference/directory-map.md`

## Implementation Notes
Do not create folders before they have a clear owner and purpose.
