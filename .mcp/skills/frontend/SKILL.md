# Frontend Skill

## Purpose
Build accessible, responsive, CRM-focused UI using App Router and small client boundaries.

## Required Reading
- `docs/05-design/design-system.md`
- `docs/05-design/crm-layout.md`
- `docs/02-architecture/rendering.md`
- `docs/04-engineering/react.md`

## Rules
- Server Components by default.
- Client Components only for interaction.
- Use Tailwind and design system rules.
- Support keyboard, mobile, and dark mode.

## Forbidden Shortcuts
- Full-page Client Components without need.
- Decorative layouts that slow CRM workflows.
- Unlabeled form controls.

## Handoff Format
List UI behavior, states, responsiveness, accessibility checks, and screenshots if used.

## Review Checklist
- Loading, empty, error, success states.
- No text overflow.
- Focus states visible.

## Acceptance Criteria
The UI is usable repeatedly by a sales user.

## Prerequisites
- `docs/01-product/workflows.md`

## Related Documents
- `checklists/ui.md`

## Used By
- Frontend implementation

## See Also
- `examples/good-component/README.md`

## Implementation Notes
CRM UX should feel operational, not promotional.
