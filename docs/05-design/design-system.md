# Design System

LeadFlow AI should look like a focused SaaS workspace: dense, calm, fast, and trustworthy.

## Visual Direction
- Neutral grayscale foundation.
- Blue accent for primary action.
- Green for success.
- Amber for warnings.
- Red for destructive or danger.
- No flashy gradients or decorative backgrounds.
- Cards are secondary; tables, timelines, filters, and panels carry the product.

## Tokens
Use Tailwind theme values and CSS variables where appropriate. Keep spacing consistent with 4px increments. Use restrained radii, typically 6-8px for controls and cards.

## Typography
Use clear hierarchy. Dashboard and CRM surfaces should favor compact headings and readable table text, not hero-scale marketing type.

## Components
Buttons, inputs, selects, tabs, tables, badges, dialogs, toasts, and side navigation should be reusable through `components/ui` when they are business-free.

## Motion
Use 150-250ms transitions for focus, hover, panel reveal, and loading. Avoid bounce and spectacle.

## Prerequisites
- `docs/01-product/personas.md`

## Related Documents
- `docs/05-design/crm-layout.md`
- `docs/05-design/accessibility.md`

## Used By
- Frontend agents
- UX review

## See Also
- `checklists/ui.md`

## Implementation Notes
Do not create isolated color, typography, or spacing documents unless the design system becomes too large to maintain.
