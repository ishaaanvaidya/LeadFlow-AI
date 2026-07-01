# Vercel Deployment

Vercel is the default hosting target because it fits Next.js App Router deployments and portfolio demos.

## Requirements
- Configure project from repository.
- Set environment variables in Vercel dashboard.
- Confirm build command remains `npm run build`.
- Confirm Node runtime compatibility with installed dependencies.

## Database
SQLite is local-first. Production should move to PostgreSQL before real multi-session demo data matters.

## AI Keys
Provider keys must be server-only Vercel environment variables. Never prefix them with `NEXT_PUBLIC_`.

## Prerequisites
- `docs/08-deployment/deployment.md`

## Related Documents
- `docs/08-deployment/environment-variables.md`

## Used By
- Deployment tasks

## See Also
- `checklists/deployment.md`

## Implementation Notes
Preview deployments are useful for review but must not be treated as production security validation by themselves.
