## Why

Codex Manager's core product is an AntigravityManager-style account/resource pool. The app now has a secure Electron foundation and local persistence, so the next step is to implement the account/resource system that future quota monitoring, switching, backup, and proxy routing will depend on.

## What Changes

- Add an account/resource domain model with provider, display metadata, status, timestamps, and secret references.
- Add SQLite persistence for account metadata without storing raw secrets.
- Add account CRUD behavior through repository/service modules.
- Add account import/export for metadata-only account pools.
- Add secret handling through the existing `SecretStorage` boundary.
- Add typed IPC/preload methods for add/list/update/delete/import/export account workflows.
- Add tests for account model validation, CRUD, import/export, status states, and secret handling.

## Capabilities

### New Capabilities

- `account-resource-system`: Defines Codex account/resource metadata, status states, CRUD operations, metadata import/export, and secure secret-reference handling.

### Modified Capabilities

- `local-persistence`: Adds account metadata persistence on top of the existing migration/repository foundation.
- `app-foundation`: Adds account IPC/preload contracts that follow the established typed IPC pattern.

## Impact

- Affected code: shared account contracts, storage migrations/repositories, account service, IPC handlers, preload API, tests, and minimal renderer shell usage if needed.
- Affected systems: account/resource management, local persistence, secure secret boundary, future quota/switching/proxy/backup features.
- No quota fetching, account switching, backup snapshot creation, or proxy request routing is implemented in this change.
