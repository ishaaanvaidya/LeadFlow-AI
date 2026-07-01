# Accessibility

Accessibility is part of enterprise quality.

## Requirements
- Semantic HTML.
- Keyboard navigation for forms, tables, dialogs, and menus.
- Visible focus rings.
- WCAG AA contrast.
- Labels for inputs.
- ARIA only when semantic HTML is insufficient.
- Reduced-motion respect where animations are used.

## CRM-Specific Concerns
Tables need clear headers. Pipeline drag/drop needs keyboard alternatives or explicit accessible controls. Toasts should not be the only source of critical information.

## Prerequisites
- `docs/05-design/design-system.md`

## Related Documents
- `docs/04-engineering/react.md`
- `checklists/ui.md`

## Used By
- Frontend agents
- Reviewers

## See Also
- `docs/03-architecture/accessibility.md` in Next docs if needed

## Implementation Notes
Accessibility checks should happen during implementation, not after visual polish.
