## Why

Codex Manager needs a backup system before risky workflows like switching, account import, and future local Codex config mutation. The app already has account metadata and local persistence, so the first backup slice should capture safe account/config snapshots and expose restore/delete/list behavior without leaking secrets.

## What Changes

- Add backup snapshot metadata persistence and filesystem snapshot files.
- Add a backup service that captures account metadata and non-secret app config state.
- Add restore behavior that imports account metadata back through the account service.
- Add list and delete operations for backup snapshots.
- Add typed IPC/preload methods for create/list/restore/delete backup workflows.
- Add tests for snapshot creation, listing, restore, deletion, missing files, and secret-safe payloads.

## Capabilities

### New Capabilities

- `backup-system`: Defines secure metadata snapshot creation, listing, restore, and deletion for Codex Manager backups.

### Modified Capabilities

- `local-persistence`: Adds backup snapshot index persistence and repository-backed access.
- `account-resource-system`: Uses account metadata export/import as the account portion of backup and restore.
- `app-foundation`: Adds backup IPC/preload contracts that follow the established typed IPC pattern.

## Impact

- Affected code: shared backup contracts, storage migrations/repositories, backup service, IPC handlers, preload API, and tests.
- Affected systems: backup/restore, local persistence, account metadata import/export, future switching safety.
- No actual Codex local config mutation, account switching, quota fetching, or proxy routing is implemented in this change.
