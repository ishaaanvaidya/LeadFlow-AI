# Product Requirements Document

LeadFlow AI is an AI-powered CRM MVP for portfolio and demo use. It helps sales users manage leads, track pipeline progress, draft outreach, score lead quality, and view basic sales health from a single workspace.

## Problem
Traditional CRMs often become passive data stores. Sales users waste time drafting emails, deciding which lead matters, and reconstructing customer context from scattered notes. Small teams need CRM memory plus lightweight intelligence.

## MVP Scope
- Email/password authentication.
- Lead CRUD with owner isolation.
- Lead table with sorting, search, and filters.
- Lead detail view with notes and activity history.
- Pipeline Kanban with stages: New, Contacted, Qualified, Closed.
- AI email drafting with tone options.
- AI lead scoring as Hot, Warm, or Cold.
- AI insights panel with actionable suggestions.
- Dashboard stats: total leads, conversion rate, pipeline value, top sources, stage counts.
- Responsive dark/light UI.

## Out Of Scope
- Email sending.
- Calendar scheduling.
- Multi-user teams and RBAC.
- Billing.
- Native mobile app.
- CRM import/export.
- Training custom ML models.

## Success Criteria
- A new user can sign up, log in, and see an empty dashboard.
- A lead can be created, edited, deleted, searched, filtered, and shown in pipeline.
- AI email draft returns a coherent draft or a friendly error.
- Hot/Warm/Cold scoring appears per lead.
- Dashboard metrics match stored data.
- Mobile width at 375px remains usable.

## Prerequisites
- `docs/00-project/vision.md`

## Related Documents
- `docs/01-product/workflows.md`
- `docs/01-product/acceptance-criteria.md`
- `docs/02-architecture/domain-model.md`

## Used By
- Feature planning
- QA
- Demo preparation

## See Also
- `BRD_LeadFlow_AI_CRM.pdf`

## Implementation Notes
Use this PRD to decide scope. If a feature is not in MVP scope, record it in `.context/future-features.md`.
