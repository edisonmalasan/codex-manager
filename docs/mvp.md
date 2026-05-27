# MVP

This document keeps Codex Manager focused. The MVP is a Codex-oriented equivalent of AntigravityManager: a local desktop manager for accounts/resources, quota monitoring, switching, secure backup, proxying, and process control.

## MVP Capabilities

### Account Pool

The user can add, view, refresh, disable, delete, import, and export Codex-related accounts/resources.

Each account should show:

- Display name or email.
- Provider/resource type.
- Status.
- Last used time.
- Last refreshed time.
- Quota summary.
- Per-account proxy indicator when configured.

### Real-Time Quota Monitoring

The user can see current quota and health for all accounts.

MVP behavior:

- Manual refresh for one account.
- Batch refresh for all accounts.
- Visual usage indicators.
- Reset time when available.
- Status categories for active, low quota, rate-limited, expired, invalid, and unknown.

### Smart Switching

The user can switch the active account manually.

MVP switching behavior:

- Back up current local state before switching.
- Validate the target account where possible.
- Apply the target account state.
- Record switch history and last used time.
- Show success or failure clearly.

Auto-switching may be included in the MVP if the account/quota foundation is stable. If included, it should switch only when the active account is rate-limited, expired, invalid, or below a configured quota threshold.

### Secure Backup

The user can capture and restore local Codex account/config snapshots.

MVP backup behavior:

- Create snapshot before switching.
- List snapshots.
- Restore a selected snapshot.
- Delete snapshots.
- Keep secrets encrypted or outside exported plaintext.

### Local API Proxy

The user can run a local proxy for development tools.

MVP proxy behavior:

- Start and stop proxy.
- Configure local port and timeout.
- Require local API key.
- Show proxy service status.
- Route requests through the selected account/resource.
- Provide cURL and Python examples.

### Process Control

The user can inspect and control related local Codex tools.

MVP process behavior:

- Detect running state.
- Launch through configured path or URI.
- Gracefully close.
- Force close only as an explicit fallback.
- Restart after switching when required.

### Settings

MVP settings should include:

- Local Codex config path.
- Proxy port, timeout, and local API key.
- Quota refresh interval.
- Low quota threshold.
- Auto-switch enablement.
- Backup retention.
- Theme and language.

## Non-Goals

The MVP will not include:

- Cloud sync.
- Team administration.
- Billing.
- Remote execution.
- Plugin marketplace.
- Advanced analytics.
- Fully autonomous account farming.
- Broad workspace/session/task management unrelated to account/resource management.

## Acceptance Bar

The MVP is successful when a user can open Codex Manager, manage multiple accounts/resources, see which ones are usable, switch safely, recover from backups, run a local proxy, and control the related local process without manually editing config files.
