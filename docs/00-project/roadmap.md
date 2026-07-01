# Development Roadmap

The roadmap is phased to prevent architecture drift. Complete the foundation before expanding CRM scope.

## Phase 1: Engineering OS And Foundation
- Documentation architecture, ADRs, skills, templates, examples, context, and checklists.
- Next.js baseline cleanup.
- Environment conventions and dependency plan.

## Phase 2: Authentication
- Better Auth setup.
- Sign up, login, logout, session reading, protected app shell.
- Auth validation and friendly error handling.

## Phase 3: Database
- Prisma setup with SQLite.
- Core domain models.
- Seed script for demo data.
- Migration discipline and indexes.

## Phase 4: CRM Core
- Dashboard shell.
- Leads table, detail view, create/edit/delete.
- Pipeline Kanban.
- Activity log, notes, search, and filters.

## Phase 5: AI Layer
- AI provider abstraction.
- Email draft generation.
- Lead scoring.
- Insights panel.
- Structured outputs and error handling.

## Phase 6: Launch Prep
- Responsive polish.
- Accessibility pass.
- Performance pass.
- Demo data and Vercel deployment.

## Prerequisites
- `docs/00-project/goals.md`

## Related Documents
- `.context/current-phase.md`
- `.context/next-task.md`

## Used By
- Planners
- Sprint notes
- Release checklist

## See Also
- `docs/08-deployment/production-checklist.md`

## Implementation Notes
Do not pull post-MVP integrations into the MVP unless an ADR changes the scope.
