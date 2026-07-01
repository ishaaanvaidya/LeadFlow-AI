# Environment Variables

Environment variables define runtime configuration and secrets.

## Variables
- `DATABASE_URL`: Prisma database connection. Required for auth and CRM data.
- `BETTER_AUTH_SECRET`: auth secret. Required in every environment.
- `BETTER_AUTH_URL`: canonical app URL. Required in every environment.
- `NVIDIA_API_KEY`: NVIDIA NIM API key for DeepSeek-backed AI features. Optional; AI features show safe fallback output when it is missing or unavailable.
- `OPENAI_API_KEY`: OpenAI provider key if a future adapter is enabled.
- `GEMINI_API_KEY`: Gemini provider key if a future adapter is enabled.

## Rules
- Never commit `.env`.
- Keep secrets server-side.
- Only `NEXT_PUBLIC_` variables can be used in browser code.
- Missing required variables should fail clearly at startup or feature boundary.
- Missing optional AI provider variables must not block core CRM workflows.

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
