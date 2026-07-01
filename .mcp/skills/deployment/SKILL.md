# Deployment Skill

## Purpose
Prepare the app for preview and production demo deployment.

## Required Reading
- `docs/08-deployment/deployment.md`
- `docs/08-deployment/vercel.md`
- `docs/08-deployment/production-checklist.md`

## Rules
- Verify build and lint.
- Confirm env vars.
- Check migrations and demo data.
- Confirm AI failures are safe.

## Forbidden Shortcuts
- Deploying with missing secrets.
- Ignoring failed build output.

## Handoff Format
List environment, commands, results, URL if deployed, and risks.

## Review Checklist
- Build.
- Env.
- Database.
- Auth.
- Core flows.

## Acceptance Criteria
Demo is stable and recoverable.

## Prerequisites
- `checklists/deployment.md`

## Related Documents
- `docs/08-deployment/monitoring.md`

## Used By
- Release work

## See Also
- `checklists/release.md`

## Implementation Notes
Deployment starts before clicking deploy: config and secrets decide success.
