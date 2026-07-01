# Data Flow

Data flow describes how information moves from user intent to persisted state and back to UI.

## Create Lead Flow
1. User submits lead form.
2. Server Action receives form data.
3. Zod validates fields.
4. Auth helper resolves current user.
5. DAL creates lead scoped to user.
6. DAL records `LeadCreated` activity.
7. UI revalidates or redirects to the updated surface.

## AI Draft Flow
1. User requests a draft from lead detail.
2. Server verifies user and lead ownership.
3. DAL returns minimal lead context.
4. AI service builds a structured prompt.
5. Provider returns structured draft.
6. Server validates output.
7. Email draft is returned or stored according to feature spec.
8. UI shows editable draft or safe error.

## Dashboard Flow
1. Server page requests dashboard DTO.
2. DAL aggregates counts and values by user.
3. Page renders metrics and charts.
4. Client components handle only interactive filters if needed.

## Prerequisites
- `docs/02-architecture/architecture.md`

## Related Documents
- `docs/01-product/workflows.md`
- `docs/06-ai/email-drafting.md`

## Used By
- Feature planning
- Test design

## See Also
- `examples/contact-feature/README.md`

## Implementation Notes
Every flow should identify the source of truth, validation boundary, and failure state.
