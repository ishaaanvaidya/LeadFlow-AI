# AI Skill

## Purpose
Implement AI features that are structured, safe, explainable, and optional.

## Required Reading
- `docs/06-ai/ai-architecture.md`
- `docs/06-ai/structured-outputs.md`
- `docs/06-ai/safety-and-errors.md`

## Rules
- Use provider adapters.
- Minimize context.
- Validate outputs.
- Keep humans in approval loop.

## Forbidden Shortcuts
- Raw unvalidated model text as trusted data.
- AI calls during critical CRM rendering.
- Exposing raw provider errors.

## Handoff Format
List prompt inputs, schema, provider boundary, failure states, and stored metadata.

## Review Checklist
- Output validated.
- Error state safe.
- Privacy minimized.

## Acceptance Criteria
CRM remains usable when AI is unavailable.

## Prerequisites
- `docs/03-adr/ADR-004-ai-as-enhancement.md`

## Related Documents
- `docs/06-ai/email-drafting.md`

## Used By
- AI implementation

## See Also
- `examples/good-zod-schema/README.md`

## Implementation Notes
AI should reduce user effort without pretending certainty.
