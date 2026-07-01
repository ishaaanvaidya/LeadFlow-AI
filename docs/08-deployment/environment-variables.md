# Environment Variables

Environment variables define runtime configuration and secrets.

## Planned Variables
- `DATABASE_URL`: Prisma database connection.
- `BETTER_AUTH_SECRET`: auth secret.
- `BETTER_AUTH_URL`: canonical app URL.
- `OPENAI_API_KEY`: OpenAI provider key when used.
- `GEMINI_API_KEY`: Gemini provider key when used.

## Rules
- Never commit `.env`.
- Keep secrets server-side.
- Only `NEXT_PUBLIC_` variables can be used in browser code.
- Missing required variables should fail clearly at startup or feature boundary.

## Prerequisites
- `docs/04-engineering/environment.md`

## Related Documents
- `docs/02-architecture/security.md`

## Used By
- Setup
- Deployment

## See Also
- `checklists/deployment.md`

## Implementation Notes
When adding a variable, include purpose, required environments, and an example safe value.
