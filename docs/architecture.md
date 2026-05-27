# Architecture

Codex Manager is an Electron desktop app modeled after AntigravityManager. It manages Codex-related accounts/resources, quota and health monitoring, account switching, local API proxying, secure backups, and process control.

## Process Model

The app uses three boundaries:

- Main process: trusted backend for account state, filesystem access, encrypted persistence, process control, quota polling, proxy server lifecycle, backups, notifications, tray integration, and OS integration.
- Preload: narrow bridge that exposes approved typed APIs.
- Renderer: untrusted React UI for account dashboards, quota views, proxy settings, backup views, settings, and user actions.

Renderer code must not access Node, Electron main APIs, raw IPC, account files, proxy credentials, or the filesystem directly. Every privileged operation flows through preload and main-process handlers.

## IPC Flow

The normal flow is:

1. A renderer route/component calls a typed hook or action.
2. The hook/action calls the preload bridge.
3. Preload forwards the request over an approved IPC channel.
4. Main validates input with a schema.
5. Main calls a domain service.
6. The service reads/writes persistence, touches local Codex config, checks quota, starts the proxy, or performs a controlled process action.
7. Main returns a typed result, mapped error, or observable operation status.

Recommended IPC domains:

- `account`
- `quota`
- `switching`
- `proxy`
- `backup`
- `process`
- `config`
- `database`
- `window`
- `tray`

Long-running operations should publish status updates or persist operation state. This includes quota refresh, account validation, auto-switch decisions, backup/restore, import/export, and proxy startup.

## Account And Resource Model

An account represents one Codex-related identity or API resource that can be used by the manager.

Account metadata should include:

- Stable id.
- Provider or resource type.
- Display name and email when available.
- Avatar when available.
- Status: active, rate-limited, expired, invalid, disabled, or unknown.
- Last used time.
- Last refresh time.
- Quota summary by model or capability.
- Reset time when available.
- Proxy settings when configured.
- Secret references, never raw secrets in renderer state.

The renderer may display safe account summaries. Main process services own credentials, refresh, validation, switching, and state writes.

## Quota And Monitoring Model

Quota monitoring should follow AntigravityManager's operational shape:

- Manual refresh for one account or all accounts.
- Background refresh at configurable intervals.
- Per-model or per-capability quota display.
- Health status derived from quota, auth validity, and rate-limit signals.
- Notification thresholds for low quota or unhealthy state.
- Sorting by recently used, total available quota, specific model availability, or account status.

Quota checks must avoid excessive polling. Services should enforce interval limits and backoff after failures.

## Switching Model

Switching changes the active Codex account/resource used by local tools or the proxy.

Switching must:

- Back up current local account/config state before mutation.
- Validate the target account before activation when possible.
- Stop or coordinate affected processes when required.
- Apply the target state atomically where possible.
- Roll back or surface recovery instructions on failure.
- Record last used time and switch outcome.

Auto-switching should be conservative: trigger only when the current account is exhausted, rate-limited, expired, invalid, or below the configured threshold.

## Local API Proxy

The local proxy provides OpenAI/Anthropic-compatible or Codex-compatible endpoints for development tools.

Proxy responsibilities:

- Start and stop with visible status.
- Bind to a configurable local port.
- Require a local API key.
- Route requests through the selected account/resource.
- Map models where configured.
- Apply request timeout and retry policy.
- Redact sensitive payloads in logs.
- Provide generated cURL and Python examples.

The proxy runs under main-process supervision. Renderer configures and observes it; renderer does not host it.

## Persistence Layer

Use SQLite for canonical structured app data:

- Account metadata.
- Quota snapshots.
- Switch history.
- Proxy settings.
- Backup index.
- App configuration.
- Notifications.
- Migrations.

Use the filesystem for larger artifacts:

- Backup snapshots.
- Logs.
- Export bundles.
- Debug traces with redaction.

Use OS credential storage or encrypted persistence for secrets:

- Tokens.
- Refresh tokens.
- API keys.
- Proxy credentials.
- Encryption keys.

Persistence should be migration-first from the beginning. Schema changes need OpenSpec when they affect behavior or contracts.

## Process And Tray Architecture

Process control should support:

- Detecting whether Codex-related tools are running.
- Launching through an allowlisted executable path or URI.
- Graceful close.
- Escalated termination only after graceful close fails.
- Restart after account switch when required.

Tray mode should support background monitoring, quick status, open app, proxy status, and quit.

## Folder Structure

Recommended target structure:

```plaintext
src/
  main/
    app.ts
    windows/
    menus/
    tray/
  preload/
    index.ts
    bridge.ts
  renderer/
    App.tsx
    routes/
    layouts/
    components/
    hooks/
    actions/
    styles/
  shared/
    types/
    schemas/
    constants/
  ipc/
    account/
    quota/
    switching/
    proxy/
    backup/
    process/
    config/
    database/
  services/
    AccountService.ts
    QuotaService.ts
    AutoSwitchService.ts
    ProxyService.ts
    BackupService.ts
    ProcessService.ts
    ConfigService.ts
  storage/
    database.ts
    migrations/
    repositories/
  server/
    proxy/
    gateway/
  tests/
    unit/
    integration/
    e2e/
docs/
openspec/
.agents/skills/
```

The existing simple Electron seed can evolve toward this structure incrementally. Large folder migrations require OpenSpec.
