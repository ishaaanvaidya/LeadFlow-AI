# API Architecture

LeadFlow AI uses Route Handlers and Server Actions deliberately.

## Route Handlers
Use `app/api/**/route.ts` for public HTTP-like boundaries, AI calls initiated from client widgets, webhooks, health checks, and future integrations. Every handler validates method, session, ownership, and body.

## Server Actions
Use Server Actions for forms and first-party mutations such as create lead, update lead, move stage, add note, and request AI draft from a form-driven interaction. Server Actions are still reachable through POST and must authorize internally.

## Response Shape
Use predictable success/error shapes:

```ts
interface ActionResult<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## API Rules
- Validate request data with Zod.
- Never trust IDs from the client without ownership checks.
- Map internal errors to user-safe messages.
- Keep raw provider responses out of UI unless sanitized.

## Prerequisites
- Next docs: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`

## Related Documents
- `docs/02-architecture/security.md`
- `docs/02-architecture/error-handling.md`

## Used By
- Backend agents
- API templates

## See Also
- `templates/api-route-template.md`
- `templates/server-action-template.md`

## Implementation Notes
If both a Route Handler and Server Action could work, prefer the one that best matches the caller and document why.
