# AI Lead Scoring

Lead scoring helps users prioritize outreach. It is advisory, explainable, and based on available CRM signals.

## Score Values
- Hot: strong fit or high urgency.
- Warm: plausible opportunity with incomplete or moderate signals.
- Cold: weak fit, low intent, or limited useful context.

## Input Signals
Potential signals include source, company, notes, stage, engagement activity, estimated value, and recency. Missing data should reduce confidence, not cause invented certainty.

## Output
Return score, confidence, explanation, and next action. Store score history when implemented so changes can be audited.

## Prerequisites
- `docs/02-architecture/domain-model.md`

## Related Documents
- `docs/06-ai/structured-outputs.md`
- `docs/01-product/business-rules.md`

## Used By
- AI scoring feature
- Dashboard badges

## See Also
- `checklists/review.md`

## Implementation Notes
Do not call the score "accurate ML" in UI or docs. The BRD explicitly treats demo scoring as plausible, not trained production ML.
