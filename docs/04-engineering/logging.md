# Logging Standards

Logging should help debug failures without exposing secrets or private customer data.

## Log What Matters
- Authenticated user ID or stable internal identifier where safe.
- Operation name.
- Error code.
- Provider latency for AI calls.
- Request correlation when available.

## Do Not Log
- Passwords.
- Session tokens.
- API keys.
- Full AI prompts containing private notes unless explicitly redacted.
- Raw provider responses with sensitive data.

## Prerequisites
- `docs/02-architecture/error-handling.md`

## Related Documents
- `docs/08-deployment/monitoring.md`

## Used By
- Backend agents
- Security review

## See Also
- `checklists/security.md`

## Implementation Notes
Start with structured console logs if no monitoring provider is installed; preserve the interface for later replacement.
