## Why

Codex Manager needs a safe account switching layer before it can automate account rotation or modify real Codex configuration. The first switching slice should support manual switching, always create a backup first, record history, and provide rollback/recovery behavior without touching provider-specific config files yet.

## What Changes

- Add switching contracts for manual account switch, rollback, recovery, active account state, and switch history.
- Persist switch history and active account selection in SQLite.
- Implement manual switch that validates source/target accounts and creates a backup before changing active selection.
- Implement rollback behavior that restores the previous active account for the latest successful switch and records recovery status.
- Expose typed IPC/preload methods for switch, rollback, current switch state, and history listing.
- Add tests for successful switching, backup-before-switch, rollback, failed validation, and history persistence.

## Capabilities

### New Capabilities

- `switching-system`: Defines manual account switch, backup-before-switch, rollback/recovery behavior, active account state, and switch history.

### Modified Capabilities

- `account-resource-system`: Switching updates account usage timestamps and uses account records as source/target identities.
- `backup-system`: Manual switching SHALL create a backup before changing active account selection.
- `app-foundation`: Switching operations are exposed through the established typed IPC/preload foundation.
- `local-persistence`: Switch state and switch history are stored behind repository/service boundaries.

## Impact

- Affected code: shared switching contracts, storage migration/repository, switching service, backup/account integration, IPC handlers, preload API, and tests.
- Affected systems: account pool, backups, future Codex config mutation, future process control, and future auto-switching.
- No automatic switching, real Codex config mutation, process restart, quota-triggered switching, or UI dashboard work is implemented in this change.
