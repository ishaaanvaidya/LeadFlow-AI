# Security Checklist

## Checklist
- Session checked server-side.
- Ownership enforced in DAL or service.
- Inputs validated with Zod.
- Secrets remain server-only.
- Raw errors are not shown.
- Logs avoid sensitive values.
- AI context minimized.
- Client-side checks are not treated as authorization.

## Prerequisites
- `docs/02-architecture/security.md`

## Related Documents
- `.mcp/skills/security/SKILL.md`

## Used By
- Security review

## See Also
- `docs/01-product/permissions.md`

## Implementation Notes
If one item cannot be verified, document the residual risk.
