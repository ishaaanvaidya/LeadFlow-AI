# Project Summary

LeadFlow AI is an AI-native CRM MVP for a portfolio/demo SaaS. It manages leads, companies, contacts, deals, pipeline stages, tasks, meetings, notes, activity history, dashboard metrics, global search, a command palette, and AI-assisted email drafting, scoring, and insights.

## Current Architecture
- Next.js `16.2.9` App Router.
- React `19.2.4`.
- TypeScript.
- Tailwind v4.
- Prisma with the generated client under `src/generated/prisma`.
- Better Auth.
- Zod validation at server/action and AI output boundaries.
- Server-only DAL modules for business data.
- NVIDIA NIM-backed AI adapter with graceful fallback when the provider is unavailable.

## Implementation Status
The CRM MVP vertical slices are implemented through dashboard, leads, companies, contacts, deals, pipeline, tasks, meetings, notes, activities, global search, command palette, dashboard query layer, and AI insights.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `docs/00-project/vision.md`
- `docs/01-product/PRD.md`

## Used By
- Every agent session

## See Also
- `.context/current-phase.md`

## Implementation Notes
Read this file first to avoid rediscovering the project from scattered docs.
