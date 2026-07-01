# Monitoring

Monitoring helps the demo behave predictably and makes failures debuggable.

## MVP Signals
- Build failures.
- Runtime errors.
- AI provider latency and failures.
- Authentication errors.
- Slow dashboard or lead list responses.

## Future Tools
Sentry, OpenTelemetry, and provider dashboards can be added when the app moves beyond local MVP.

## Logging
Logs must avoid secrets, full prompts with private notes, and raw tokens.

## Prerequisites
- `docs/04-engineering/logging.md`

## Related Documents
- `docs/02-architecture/performance.md`
- `docs/06-ai/safety-and-errors.md`

## Used By
- Deployment review
- Debugging

## See Also
- `checklists/release.md`

## Implementation Notes
Add monitoring gradually, but keep interfaces clean so providers can be introduced without rewriting feature code.
