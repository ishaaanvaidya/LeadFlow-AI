<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LeadFlow AI Agent Constitution

LeadFlow AI is an AI-native CRM for modern sales teams. Agents must treat this repository as a documentation-driven product system, not as a blank Next.js app.

## Mission
Build a portfolio-grade SaaS CRM where AI acts like a careful sales assistant: it suggests, drafts, scores, and summarizes, while humans approve important business decisions.

Every architecture decision must support:

- Less manual CRM work.
- Intelligent automation with graceful degradation.
- Clean enterprise UX.
- Type-safe and maintainable code.
- Security and scalability from the first implementation.

## Documentation Authority
Documentation is the source of truth. If documentation conflicts with code, stop and identify the conflict before changing implementation. Do not silently rewrite architecture.

If documentation does not explicitly define a pattern, do not invent one. Instead, leave a clearly marked recommendation section explaining the options and why a decision is deferred.

Every implementation task must follow the relevant docs, templates, examples, checklists, and skills in this repository. Do not generate shallow skeleton documentation or filler content.

## Required Reading Order
Before implementation, read in this order:

1. `.context/project-summary.md`
2. `.context/current-phase.md`
3. `.context/next-task.md`
4. `docs/03-adr/`
5. `docs/02-architecture/architecture.md`
6. `docs/02-architecture/domain-model.md`
7. `docs/04-engineering/`
8. `docs/05-design/`
9. Feature-specific documentation
10. Implementation files only after reading the relevant docs

## AI Review Workflow
Every meaningful implementation should pass through this review path:

`Planner -> Architect -> Frontend/Backend -> Database -> Testing -> Review -> Security -> Deployment`

Use `.mcp/skills/` as role-specific operating instructions for those phases.

## Core Principles
Priority order:

1. Correctness
2. Maintainability
3. Type safety
4. User experience
5. Performance
6. Developer experience

Never sacrifice architecture for speed.

## Tech Stack
Use the actual repo stack unless an ADR changes it:

- Next.js `16.2.9` App Router
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- Prisma with SQLite first, PostgreSQL later
- Better Auth
- Zod
- React Hook Form
- TanStack Table
- TanStack Query where client-side query orchestration is justified
- Zustand only for global UI/app state
- Recharts
- Lucide React
- Motion
- Sonner
- npm

The BRD mentions older options such as Next.js 14 and NextAuth. Treat those as historical product intent, not current architecture.

## Rendering Rules
Default to Server Components.

Use Client Components only for:

- State and event handlers.
- Browser APIs.
- Forms that need client-side interactivity.
- Drag and drop.
- Animations.
- Toasts and optimistic UI.

Never add `"use client"` without a local reason.

## Data Rules
Use a server-only Data Access Layer for business data. Database objects should not be passed directly into Client Components. Return minimal DTOs after authentication, authorization, and validation.

AI is an enhancement, not a dependency. CRM CRUD, dashboard, pipeline, search, and activity log must still work if the LLM provider fails.

## TypeScript Rules
Never use `any`. Never disable strict mode. Use `interface` for object shapes and `type` for unions. Validate all untrusted input with Zod before business logic.

## UI Rules
Build dense, professional CRM interfaces. Tables and workflows are primary; decorative cards are secondary. Support responsive layouts, keyboard access, visible focus states, WCAG AA contrast, and dark mode.

## Git And Generated Files
Do not commit `node_modules`, `.env`, build output, local caches, or secrets. Keep commits small and meaningful when commits are requested.

## Definition Of Done
A task is complete only when:

- It follows the Engineering OS docs.
- It builds without TypeScript errors.
- ESLint passes.
- UI is responsive and accessible.
- Dark mode is supported where UI is touched.
- Security and validation are handled.
- Documentation is updated when architecture changes.
- Self-review has been completed with the relevant checklist.

## Prerequisites
- Installed Next.js docs under `node_modules/next/dist/docs/`

## Related Documents
- `.context/project-summary.md`
- `docs/02-architecture/architecture.md`

## Used By
- Codex
- Antigravity
- Claude Code
- Human reviewers

## See Also
- `.mcp/skills/planner/SKILL.md`
- `checklists/review.md`

## Implementation Notes
This file is the first-read instruction surface. Detailed behavior belongs in the Engineering OS docs.
