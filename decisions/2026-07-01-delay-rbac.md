# Decision: Delay RBAC

## Decision
Delay multi-user teams and role-based permissions until after MVP.

## Reason
The BRD marks multi-user teams and RBAC as post-MVP. Owner isolation is still mandatory.

## Revisit When
Organizations, invitations, or team dashboards are introduced.

## Prerequisites
- `docs/01-product/permissions.md`

## Related Documents
- `docs/02-architecture/security.md`

## Used By
- Scope control

## See Also
- `.context/future-features.md`

## Implementation Notes
Do not build RBAC UI during MVP, but avoid schema choices that make RBAC impossible.
