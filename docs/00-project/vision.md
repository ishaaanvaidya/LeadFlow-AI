# LeadFlow AI Vision

LeadFlow AI is an AI-native CRM for founders, small B2B teams, and sales reps who need a faster way to manage relationships. The product should feel like a focused sales workspace with an embedded assistant, not like a generic database with a chat box attached.

The CRM stores business relationships: who the customer is, where they are in the sales process, what happened before, what should happen next, and which opportunities deserve attention. AI helps by drafting emails, scoring leads, surfacing insights, and reducing repetitive thinking, but humans approve decisions.

## Product Direction
The MVP proves five capabilities:

- Users can securely access their own CRM.
- Leads can be created, edited, searched, filtered, and moved through a pipeline.
- Activity history records important relationship events.
- Dashboard metrics summarize sales health.
- AI can draft emails, score leads, and suggest next actions without breaking the core CRM when unavailable.

## Experience Principles
- Dense, calm, enterprise UI over marketing-style pages.
- Tables, filters, detail panels, and timelines are primary surfaces.
- Every screen should answer a practical sales question.
- AI suggestions must be reviewable, editable, and safe to ignore.

## Non Goals
LeadFlow AI is not an ERP, HRMS, accounting system, marketing automation suite, or billing platform. Email sending, calendar sync, CRM import, RBAC, and billing are intentionally delayed until after the MVP foundation is stable.

## Prerequisites
- Read `AGENTS.md`.
- Read `.context/project-summary.md`.

## Related Documents
- `docs/01-product/PRD.md`
- `docs/02-architecture/architecture.md`
- `docs/06-ai/ai-architecture.md`

## Used By
- Planning agents
- Product implementation tasks
- README summaries

## See Also
- `docs/00-project/project-principles.md`
- `docs/01-product/workflows.md`

## Implementation Notes
When a feature request conflicts with this vision, prefer the narrower CRM interpretation and record broader ideas in `.context/future-features.md`.
