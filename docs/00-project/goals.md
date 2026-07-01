# Engineering Goals

LeadFlow AI should demonstrate professional full-stack judgment, not just framework familiarity. The implementation must be understandable, maintainable, secure by default, and realistic enough for a portfolio demo.

## Product Goals
- Reduce manual CRM work through faster lead entry, search, pipeline movement, AI email drafting, lead scoring, and insights.
- Keep the CRM useful when AI fails.
- Make the MVP live-demo ready with credible demo data and stable user flows.
- Avoid scope creep until the BRD acceptance criteria are satisfied.

## Technical Goals
- Use Next.js App Router with Server Components by default.
- Centralize business data access in a server-only Data Access Layer.
- Validate all untrusted input with Zod.
- Keep feature code isolated under feature folders.
- Use Prisma with SQLite first and a clear migration path to PostgreSQL.
- Keep UI responsive at 375px and above.

## Quality Goals
- Dashboard and lead list should target sub-2-second load in normal demo conditions.
- AI email generation should target sub-5-second response with friendly failure states.
- Core UI should meet WCAG AA contrast and keyboard interaction expectations.
- ESLint and TypeScript checks must pass before a task is complete.

## Prerequisites
- `docs/00-project/vision.md`

## Related Documents
- `docs/04-engineering/definition-of-done.md`
- `docs/02-architecture/performance.md`

## Used By
- Reviewers
- Testing agents
- Release planning

## See Also
- `checklists/performance.md`
- `checklists/review.md`

## Implementation Notes
When goals compete, correctness and data safety win over speed of delivery.
