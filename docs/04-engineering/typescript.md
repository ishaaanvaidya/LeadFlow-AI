# TypeScript Standards

TypeScript is a design tool, not just a compiler setting.

## Rules
- Never use `any`.
- Use `unknown` for untrusted data before validation.
- Use `interface` for object shapes.
- Use `type` for unions, literals, mapped types, and utility compositions.
- Prefer inferred local variables when obvious.
- Export types only when used across module boundaries.
- Use discriminated unions for state machines and result objects.

## Validation
Zod schemas define runtime boundaries. Derive TypeScript types from schemas where the schema is the source of truth.

## Error Results
Prefer typed result shapes for expected failures. Throw only for unexpected failures or framework boundaries.

## Prerequisites
- `docs/04-engineering/coding-standards.md`

## Related Documents
- `docs/02-architecture/api.md`
- `examples/good-zod-schema/README.md`

## Used By
- Frontend and backend agents

## See Also
- `templates/api-route-template.md`

## Implementation Notes
If TypeScript fights the design, simplify the design before weakening types.
