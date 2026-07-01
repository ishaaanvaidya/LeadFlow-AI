# AI Architecture

AI in LeadFlow AI is a service layer that reads CRM context and returns suggestions. It does not own truth.

## Responsibilities
- Draft personalized outreach emails.
- Produce Hot/Warm/Cold lead scores with explanations.
- Suggest next actions.
- Summarize relevant context where future features require it.

## Boundaries
AI receives minimal context, never raw user records by default. Provider calls are wrapped in an adapter. Outputs are structured, validated, and displayed as editable suggestions.

## Provider Strategy
Support OpenAI or Gemini through an internal provider interface. Do not scatter provider-specific SDK calls through feature code.

## Prerequisites
- `docs/03-adr/ADR-004-ai-as-enhancement.md`

## Related Documents
- `docs/06-ai/structured-outputs.md`
- `docs/06-ai/safety-and-errors.md`

## Used By
- AI implementation
- Backend agents

## See Also
- `.mcp/skills/ai/SKILL.md`

## Implementation Notes
If provider response shape changes, update the adapter and schemas, not every feature.
