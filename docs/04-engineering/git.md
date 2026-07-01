# Git Standards

Git history should tell a clear story when the user asks for commits.

## Rules
- Keep commits focused.
- Do not commit secrets, `.env`, `node_modules`, build output, or local caches.
- Do not rewrite user work without explicit permission.
- Use non-interactive Git commands.
- Document meaningful verification in commit messages or PR summaries when asked.

## Branches
Use `codex/` prefix by default when creating branches unless the user specifies another prefix.

## Prerequisites
- `AGENTS.md`

## Related Documents
- `docs/04-engineering/feature-lifecycle.md`

## Used By
- Release tasks
- Commit tasks

## See Also
- `checklists/release.md`

## Implementation Notes
If the worktree has unrelated changes, leave them alone and mention only relevant changes.
