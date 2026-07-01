# AI Email Drafting

Email drafting is the MVP's clearest AI workflow. It should save time while keeping the user in control.

## Workflow
User opens a lead, chooses or accepts a tone, requests a draft, reviews the result, edits if needed, and copies it. Sending email is out of scope.

## Tone Options
- Formal.
- Friendly.
- Short.

## Output
Draft output should include subject, body, tone, and brief reasoning summary for debugging or user confidence. Body text should avoid unsupported claims.

## Failure States
If AI fails, show a friendly inline error and keep the lead detail page usable.

## Prerequisites
- `docs/06-ai/prompting.md`

## Related Documents
- `docs/01-product/workflows.md`
- `docs/06-ai/safety-and-errors.md`

## Used By
- Lead detail AI panel
- API route or Server Action

## See Also
- `examples/good-server-action/README.md`

## Implementation Notes
Generated drafts are starting points. UI copy should invite review, not imply automatic sending.
