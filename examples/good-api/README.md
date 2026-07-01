# Example: Good API

## Example Purpose
Show the expected Route Handler structure.

## Pattern
Validate request, resolve session, enforce ownership, call service, return safe JSON.

## Good Qualities
- No raw database model leaves the server boundary.
- Errors are mapped.
- Input schema is separate from implementation.

## Prerequisites
- `docs/02-architecture/api.md`

## Related Documents
- `templates/api-route-template.md`

## Used By
- Backend agents

## See Also
- `.mcp/skills/backend/SKILL.md`

## Implementation Notes
Use this as shape guidance, not copy-paste production code.
