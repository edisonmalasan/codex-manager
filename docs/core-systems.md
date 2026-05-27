# Core Systems

This document defines the product systems that future code and specs should align with.

## Account System

The account system owns Codex-related account/resource records.

Responsibilities:

- Add accounts/resources.
- Validate account state.
- Store safe metadata.
- Store secret references rather than raw secrets in renderer-facing state.
- Import and export account pools with schema validation.
- Deduplicate accounts during import.
- Support batch operations.
- Track account status and last used time.

The account system is the center of the product. Other systems should not duplicate account ownership.

## Quota System

The quota system owns health and usage monitoring.

Responsibilities:

- Refresh quota for one account.
- Refresh quota for all accounts.
- Track per-model or per-capability usage where available.
- Track reset times where available.
- Mark accounts active, low quota, rate-limited, expired, invalid, disabled, or unknown.
- Apply polling intervals and backoff.
- Trigger notifications when thresholds are crossed.

Quota data should include timestamps so the UI can distinguish fresh data from stale data.

## Switching System

The switching system owns active account/resource changes.

Responsibilities:

- Select a target account manually or through auto-switching.
- Back up current local state before mutation.
- Validate target readiness.
- Apply target account state.
- Coordinate related process restart when required.
- Roll back or guide recovery on failure.
- Record switch history.

Auto-switching should be threshold-driven and conservative.

## Backup System

The backup system owns snapshots of local Codex account/config state.

Responsibilities:

- Capture snapshots before risky operations.
- List snapshots.
- Restore snapshots.
- Delete snapshots.
- Enforce retention settings.
- Protect secrets during export and display.

Backups are a safety system, not just a convenience feature. Switching and migrations should integrate with it.

## Proxy System

The proxy system owns the local API proxy/gateway.

Responsibilities:

- Start and stop the proxy server.
- Bind to a configured local port.
- Require a local API key.
- Route requests through selected accounts/resources.
- Apply model mapping where configured.
- Track service health.
- Generate developer examples.
- Redact sensitive request and response data from logs.

Renderer can configure and observe the proxy, but the proxy must run under main-process supervision.

## Process Control System

The process control system owns integration with related local Codex tools.

Responsibilities:

- Detect running state.
- Launch through allowlisted executable path or URI.
- Gracefully close.
- Force close only as explicit fallback.
- Coordinate restarts after switching or config changes.
- Surface clear errors when a process cannot be controlled.

Process actions must be explicit and auditable.

## Project Storage

Project storage owns durable app state.

Responsibilities:

- Provide SQLite connection and migrations.
- Store canonical structured data.
- Store large artifacts on disk.
- Store secrets through OS credential storage or encrypted persistence.
- Provide repository APIs to services.
- Support backup/export without leaking secrets.

Suggested storage categories:

- SQLite: accounts, quota snapshots, switch history, proxy settings, backup index, app config, notification settings.
- Filesystem: backups, logs, export bundles, redacted debug traces.
- Credential store: tokens, refresh tokens, API keys, encryption keys, proxy credentials.

Storage changes that affect schema or behavior require OpenSpec.
