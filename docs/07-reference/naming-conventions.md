# Naming Conventions

Names should reveal ownership and intent.

## Files
- Components: `PascalCase.tsx`
- Hooks: `useThing.ts`
- Server actions: `thing.actions.ts`
- Data access: `thing.data.ts`
- Schemas: `thing.schema.ts`
- Types: `thing.types.ts`

## Domain
Use `Lead`, `Activity`, `EmailDraft`, and `LeadScore` consistently. Do not rename domain concepts for UI novelty.

## Booleans
Use `is`, `has`, `can`, or `should` prefixes.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `docs/02-architecture/folder-structure.md`

## Used By
- All implementation agents

## See Also
- `templates/component-template.md`

## Implementation Notes
If a name needs a comment to be understood, choose a clearer name.
