# Dashboard Design

The dashboard answers: how healthy is the sales pipeline right now?

## Required MVP Signals
- Total leads.
- Conversion rate.
- Pipeline value.
- Stage distribution.
- Top lead sources.
- Recent activity.

## Layout Rules
Metrics should be compact. Charts should be readable but not decorative. Recent activity should make it easy to resume work.

## Empty State
An empty dashboard should explain the absence of data through state, not marketing copy. The primary action is creating the first lead.

## Prerequisites
- `docs/01-product/acceptance-criteria.md`

## Related Documents
- `docs/02-architecture/data-flow.md`
- `docs/02-architecture/performance.md`

## Used By
- Dashboard implementation

## See Also
- `checklists/ui.md`

## Implementation Notes
Dashboard metrics must come from the same data source as leads and pipeline, not duplicated client calculations.
