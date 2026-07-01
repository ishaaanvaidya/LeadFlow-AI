# Example: Good Component

## Example Purpose
Show preferred component shape.

## Pattern
```tsx
interface LeadScoreBadgeProps {
  score: "hot" | "warm" | "cold" | "unknown";
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  return <span data-score={score}>{score}</span>;
}
```

## Why Good
Props are narrow, type-safe, and business meaning is explicit.

## Prerequisites
- `docs/04-engineering/react.md`

## Related Documents
- `templates/component-template.md`

## Used By
- Frontend agents

## See Also
- `checklists/ui.md`

## Implementation Notes
Real components must include accessible labels when visual meaning is not text-visible.
