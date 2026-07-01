# Architect Skill

## Purpose
Protect the system architecture and prevent undocumented patterns.

## Required Reading
- `AGENTS.md`
- `docs/03-adr/`
- `docs/02-architecture/architecture.md`
- `docs/02-architecture/domain-model.md`

## Rules
- Check whether the task changes architecture.
- Enforce DAL, App Router, and AI-as-enhancement decisions.
- Recommend options when docs do not define a pattern.

## Forbidden Shortcuts
- Inventing data models from UI alone.
- Bypassing ADRs.
- Mixing Pages Router patterns.

## Handoff Format
State architecture impact, affected docs, implementation boundaries, and deferred decisions.

## Review Checklist
- ADRs respected.
- Domain meaning preserved.
- Security boundary clear.

## Acceptance Criteria
The plan can be implemented without choosing architecture mid-task.

## Prerequisites
- `.context/architecture-decisions.md`

## Related Documents
- `docs/02-architecture/`

## Used By
- Planner
- Review

## See Also
- `templates/adr-template.md`

## Implementation Notes
Prefer fewer stronger abstractions over generic frameworks.
