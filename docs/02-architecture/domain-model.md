# Domain Model

The domain model defines business concepts before Prisma schema or UI code exists. Implementations may add fields, but they must preserve these meanings.

## Core Entities
`User` is the authenticated owner of CRM data in the MVP.

`Lead` is a potential customer relationship. A lead belongs to a user, may connect to a company/contact later, moves through the pipeline, and owns notes, activities, AI drafts, and score history.

`Company` represents an organization associated with one or more leads or contacts. In the MVP it may be stored as a lead field first, but architecture should allow promotion to an entity.

`Contact` represents a person at a company. In the MVP, lead name/email/phone may cover this, but future CRM maturity separates lead from contact.

`Deal` represents a qualified commercial opportunity with value, stage, probability, and close date. MVP pipeline value may be lead-based until deals are implemented.

`Pipeline` is a named sales process. MVP can use a default pipeline.

`PipelineStage` is an ordered stage such as New, Contacted, Qualified, or Closed.

`Task` is a follow-up action with due date and completion status.

`Meeting` is a scheduled or historical customer interaction. Calendar sync is delayed.

`Activity` is an append-only event describing important relationship history.

`Note` is user-authored context attached to a lead.

`AIConversation` stores AI interactions where persistence is useful.

`Prompt` stores reusable prompt intent and versioning metadata.

`EmailDraft` stores generated outreach text, tone, model metadata, and association to a lead.

`LeadScore` stores Hot/Warm/Cold classification, explanation, source signals, and generated time.

## Relationships
- User has many Leads.
- Lead has many Activities, Notes, EmailDrafts, and LeadScores.
- Lead may reference Company, Contact, Deal, Tasks, and Meetings as the model matures.
- Activity references the entity it describes and stores human-readable description.

## Invariants
- Business data is always scoped to user ownership.
- Lead stage must be valid for its pipeline.
- AI-generated values are explainable and revisable.
- Activities should describe state changes without becoming the source of truth for current state.

## Prerequisites
- `docs/01-product/business-rules.md`

## Related Documents
- `docs/02-architecture/database.md`
- `docs/06-ai/lead-scoring.md`

## Used By
- Prisma schema design
- API contracts
- UI naming

## See Also
- `templates/prisma-model-template.md`

## Implementation Notes
If a field does not clearly belong to an entity, document the tradeoff before adding it.
