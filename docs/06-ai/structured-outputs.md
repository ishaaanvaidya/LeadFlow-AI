# Structured Outputs

AI outputs must be machine-checkable before they influence UI or storage.

## Required Practice
Define Zod schemas for expected AI responses. Parse provider output before returning data to feature code. If parsing fails, map to an AI unavailable or invalid response state.

## Example Shape
```ts
interface EmailDraftOutput {
  subject: string;
  body: string;
  tone: "formal" | "friendly" | "short";
  reasoningSummary: string;
}
```

## Error Handling
Invalid structure is not a user fault. Show a retry option and log provider metadata safely.

## Prerequisites
- `docs/06-ai/prompting.md`

## Related Documents
- `docs/04-engineering/typescript.md`
- `docs/02-architecture/error-handling.md`

## Used By
- AI adapters
- API handlers

## See Also
- `examples/good-zod-schema/README.md`

## Implementation Notes
Do not trust JSON-like text until it has been parsed and validated.
