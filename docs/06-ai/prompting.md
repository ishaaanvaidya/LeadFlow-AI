# Prompting

Prompts should be explicit, bounded, and versionable.

## Prompt Rules
- Define the assistant role.
- Include only necessary lead context.
- State the desired output schema.
- Set tone and length constraints.
- Ask for practical sales language.
- Avoid pretending certainty when data is missing.

## Anti-Patterns
- Sending full activity history when a summary is enough.
- Asking for unstructured prose when the UI needs fields.
- Letting the model decide business state without validation.
- Showing raw prompts to users.

## Prerequisites
- `docs/06-ai/ai-architecture.md`

## Related Documents
- `docs/06-ai/email-drafting.md`
- `docs/06-ai/lead-scoring.md`

## Used By
- AI service implementation

## See Also
- `templates/feature-template.md`

## Implementation Notes
Store prompt intent and version when persistence is useful for debugging or repeatability.
