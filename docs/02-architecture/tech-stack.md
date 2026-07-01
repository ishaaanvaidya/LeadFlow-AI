# Tech Stack

The stack is chosen for a serious portfolio SaaS with modern Next.js conventions and pragmatic demo deployment.

## Current Stack
- Next.js `16.2.9` with App Router.
- React `19.2.4`.
- TypeScript.
- Tailwind CSS v4.
- Prisma ORM.
- SQLite for local MVP data, PostgreSQL for production evolution.
- Better Auth for authentication.
- Zod for validation.
- React Hook Form for complex client forms.
- TanStack Table for data tables.
- TanStack Query for client query orchestration only when needed.
- Zustand for global client state only.
- Recharts for charts.
- Lucide React for icons.
- Motion for subtle animation.
- Sonner for notifications.

## Selection Rationale
Next.js keeps frontend, server rendering, route handlers, and server actions in one deployable unit. Prisma gives schema clarity and migration discipline. SQLite lowers setup friction; PostgreSQL is the realistic SaaS target. Better Auth fits modern TypeScript auth needs without carrying the BRD's older NextAuth assumption.

## Constraints
- Do not install new dependencies casually.
- Prefer platform and framework features before adding libraries.
- Any major dependency change needs an ADR.

## Prerequisites
- `package.json`
- `docs/03-adr/`

## Related Documents
- `docs/07-reference/dependencies.md`
- `docs/08-deployment/vercel.md`

## Used By
- Setup tasks
- Dependency review

## See Also
- `AGENTS.md`

## Implementation Notes
When docs and installed package versions disagree, inspect `package.json` and create a recommendation instead of guessing.
