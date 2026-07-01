# AI Safety And Errors

AI features must fail safely and explain limitations clearly.

## Safety Rules
- Minimize prompt context.
- Validate all outputs.
- Never expose raw provider errors.
- Never execute AI-suggested actions automatically.
- Keep humans in approval loop.

## Error Mapping
- Timeout: "AI is taking longer than expected. Try again."
- Provider unavailable: "AI drafting is temporarily unavailable."
- Invalid output: "AI returned an unusable response. Regenerate the draft."
- Missing context: "Add more lead details for a better suggestion."

## Prerequisites
- `docs/06-ai/structured-outputs.md`

## Related Documents
- `docs/02-architecture/error-handling.md`
- `docs/02-architecture/security.md`

## Used By
- AI routes
- AI UI panels

## See Also
- `checklists/security.md`

## Implementation Notes
Safe AI failure is a core product quality, not an edge case.
