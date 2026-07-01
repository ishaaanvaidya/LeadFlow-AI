# Product Workflows

Workflows define how users move through the CRM. Implementation should support these paths with minimal friction.

## Signup And First Dashboard
User signs up, receives a session, and lands on an empty dashboard with clear empty states for leads, pipeline, and activity. Empty states should offer the next concrete action: create a lead.

## Lead Creation
User enters name, email, company, phone, source, estimated value, stage, and notes. The server validates input, stores the lead, creates an activity event, and returns the user to a detail or list surface.

## Lead Management
User scans the table, filters by stage/source/score, searches by name/company/email, opens a detail page, edits fields, adds notes, or deletes/archive according to implemented policy.

## Pipeline Movement
User moves a lead between stages. The system updates the stage, records an activity, and updates dashboard metrics. Drag and drop may be client-side, but persistence and authorization remain server-side.

## AI Email Draft
User opens a lead detail page, chooses a tone, and requests a draft. The server builds safe context, calls the AI provider, validates the structured response, stores or returns the draft according to implementation docs, and displays an editable draft with copy support.

## AI Lead Scoring
The system scores a lead from available profile and engagement data. The score is explanatory and non-authoritative. Users may still prioritize differently.

## Prerequisites
- `docs/01-product/PRD.md`

## Related Documents
- `docs/02-architecture/data-flow.md`
- `docs/06-ai/ai-architecture.md`

## Used By
- Feature specs
- UI implementation
- Acceptance tests

## See Also
- `checklists/feature.md`

## Implementation Notes
Every meaningful state change should create an Activity record unless a document explicitly excludes it.
