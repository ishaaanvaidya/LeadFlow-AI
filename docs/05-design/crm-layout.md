# CRM Layout

The application should open directly into usable CRM workspace once authenticated.

## App Shell
Use a persistent shell with sidebar navigation, top utility area, and main content. Navigation should prioritize Dashboard, Leads, Pipeline, Tasks, AI Assistant, and Settings as modules become available.

## Page Layouts
- Dashboard: metrics, charts, recent activity, top sources, and quick actions.
- Leads table: filters above table, dense rows, score badges, stage, source, owner context.
- Lead detail: identity summary, stage controls, AI panel, notes, activity timeline.
- Pipeline: stage columns with stable card sizes and clear drag/drop affordance.

## Responsive Behavior
At mobile widths, use collapsible navigation and stacked sections. Tables may become horizontally scrollable or card-like summaries when appropriate.

## Prerequisites
- `docs/05-design/design-system.md`

## Related Documents
- `docs/01-product/workflows.md`
- `docs/05-design/dashboard.md`

## Used By
- Frontend implementation

## See Also
- `examples/good-table/README.md`

## Implementation Notes
CRM pages should favor scanning and repeated action over large empty whitespace.
