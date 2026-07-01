# Security Architecture

Security starts at the first MVP implementation even though this is a portfolio demo.

## Authentication
Use Better Auth for email/password authentication and session management. Auth helpers must be server-side and reusable.

## Authorization
Every DAL function, Server Action, and Route Handler that touches user data must verify the authenticated user and ownership. Client-side hiding is convenience, not security.

## Input And Output Safety
- Validate inputs with Zod.
- Sanitize user-visible text where needed.
- Never expose secrets to Client Components.
- Only `NEXT_PUBLIC_` values may reach the browser.
- Return minimal DTOs.

## AI Safety
AI prompts must not include unnecessary private data. AI output must be validated, bounded, and displayed as suggestion. Provider errors become safe user messages.

## Headers And Browser Risks
Plan for CSP, secure cookies, CSRF handling through the auth library, and safe clipboard interactions. Avoid `dangerouslySetInnerHTML` unless reviewed.

## Prerequisites
- Next docs: `node_modules/next/dist/docs/01-app/02-guides/data-security.md`

## Related Documents
- `docs/01-product/permissions.md`
- `docs/02-architecture/api.md`

## Used By
- Security review
- Backend implementation

## See Also
- `checklists/security.md`

## Implementation Notes
Security is not deferred because the app is a demo. Demo apps still shape engineering habits.
