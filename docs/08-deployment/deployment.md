# Deployment

The intended MVP deployment path is Vercel for the Next.js application and a managed PostgreSQL provider when production data moves beyond local SQLite.

## Environments
- Development: local Next.js, SQLite, local env values.
- Preview: Vercel preview, managed database when needed.
- Production demo: Vercel production, managed database, restricted secrets.

## Release Requirements
- Build passes.
- Lint passes.
- Environment variables configured.
- Database migrations applied safely.
- Demo data is intentional.
- AI failure states verified.

## Prerequisites
- `docs/08-deployment/environment-variables.md`

## Related Documents
- `docs/08-deployment/vercel.md`
- `docs/08-deployment/production-checklist.md`

## Used By
- Deployment agents
- Release review

## See Also
- `checklists/deployment.md`

## Implementation Notes
Do not deploy with local secrets, debug-only code, or unreviewed migrations.
