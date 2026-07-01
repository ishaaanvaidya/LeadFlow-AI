# LeadFlow AI

LeadFlow AI is an AI-native CRM portfolio project for managing leads, pipeline activity, AI-assisted email drafts, lead scoring, and sales insights. The repository is intentionally documentation-driven so coding agents can implement features consistently instead of inventing architecture during each task.

## Project Status
The project is in foundation phase. The current work creates the Engineering OS: architecture docs, product rules, ADRs, standards, MCP skills, templates, examples, checklists, and living context. Product feature implementation starts after this documentation architecture is frozen.

## Agent Starting Point
Agents must begin with:

1. `AGENTS.md`
2. `.context/project-summary.md`
3. `.context/current-phase.md`
4. `.context/next-task.md`
5. `docs/03-adr/`
6. `docs/02-architecture/architecture.md`
7. `docs/02-architecture/domain-model.md`

Only then should implementation files be inspected or changed.

## Repository Map
- `docs/00-project/`: vision, goals, roadmap, principles.
- `docs/01-product/`: PRD, personas, workflows, permissions, business rules, acceptance criteria.
- `docs/02-architecture/`: system architecture, domain model, data flow, API, database, security, performance.
- `docs/03-adr/`: permanent architecture decisions.
- `docs/04-engineering/`: coding, testing, lifecycle, review, and delivery standards.
- `docs/05-design/`: CRM layout, dashboard, accessibility, and design system.
- `docs/06-ai/`: AI architecture, prompts, structured outputs, scoring, drafting, insights, failures.
- `docs/07-reference/`: quick reference material for agents.
- `docs/08-deployment/`: deployment, environment, monitoring, and launch readiness.
- `.mcp/skills/`: repo-local role skills for AI coding agents.
- `.context/`: living project memory.
- `templates/`: reusable implementation templates.
- `examples/`: canonical examples of preferred patterns.
- `checklists/`: completion and review checklists.
- `decisions/`: lightweight temporary decisions.

## Development
Use npm:

```bash
npm run dev
npm run lint
npm run build
```

No feature work should begin until the relevant documentation, checklist, and template have been read.

## Prerequisites
- Node.js compatible with the installed Next.js version.
- npm.
- Local `.env` values only when a feature requires them.

## Related Documents
- `AGENTS.md`
- `docs/02-architecture/architecture.md`
- `docs/04-engineering/feature-lifecycle.md`

## Used By
- Codex
- Antigravity
- Claude Code
- Human reviewers

## See Also
- `.mcp/skills/planner/SKILL.md`
- `checklists/feature.md`

## Implementation Notes
The README is a map, not the authority for architecture. Detailed decisions live in docs and ADRs.
