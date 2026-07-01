# Environment Standards

Environment configuration should be explicit, local secrets should stay local, and production values should be managed by the deployment platform.

## Variables
Expected future variables include:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `OPENAI_API_KEY` or provider equivalent
- `GEMINI_API_KEY` if Gemini is used

## Rules
- Never commit `.env`.
- Only expose browser-safe values with `NEXT_PUBLIC_`.
- Document new variables in `docs/08-deployment/environment-variables.md`.
- Fail clearly when required server variables are missing.

## Prerequisites
- `docs/02-architecture/security.md`

## Related Documents
- `docs/08-deployment/environment-variables.md`

## Used By
- Setup tasks
- Deployment tasks

## See Also
- `checklists/deployment.md`

## Implementation Notes
Do not introduce environment variables without documenting purpose, required environments, and safe example values.
