# Security Skill

## Purpose
Protect user data, secrets, sessions, and AI boundaries.

## Required Reading
- `docs/02-architecture/security.md`
- `docs/01-product/permissions.md`
- `checklists/security.md`

## Rules
- Verify auth and ownership.
- Validate input.
- Keep secrets server-side.
- Minimize AI context.

## Forbidden Shortcuts
- Client-only protection.
- Raw errors in UI.
- Logging secrets.

## Handoff Format
List protected resources, checks performed, risks, and mitigations.

## Review Checklist
- Session verified.
- Ownership enforced.
- Output sanitized.
- Environment variables safe.

## Acceptance Criteria
No known path exposes another user's CRM data.

## Prerequisites
- `docs/03-adr/ADR-003-better-auth.md`

## Related Documents
- `docs/08-deployment/environment-variables.md`

## Used By
- Security review

## See Also
- `checklists/security.md`

## Implementation Notes
Demo scope does not remove data protection requirements.
