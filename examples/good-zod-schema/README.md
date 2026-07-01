# Example: Good Zod Schema

## Example Purpose
Show validation as a business boundary.

## Pattern
```ts
const leadName = z.string().trim().min(1).max(120);
```

## Good Qualities
- Trims input.
- Sets lower and upper bounds.
- Can be reused by server action and tests.

## Prerequisites
- `docs/04-engineering/typescript.md`

## Related Documents
- `docs/06-ai/structured-outputs.md`

## Used By
- Backend agents
- AI agents

## See Also
- `templates/test-template.md`

## Implementation Notes
Schemas should reflect business rules, not just database field types.
