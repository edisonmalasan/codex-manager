## Why

Codex Manager needs a reliable local persistence layer before account pools, quota snapshots, switching history, backups, proxy settings, and process-control settings can be implemented safely. Building persistence as its own change keeps storage, migrations, config, and secret boundaries clear before domain data starts depending on them.

## What Changes

- Add a local SQLite persistence foundation under the existing app architecture.
- Add migration support so schema changes are versioned from the start.
- Add repository boundaries for app configuration and future domain tables.
- Add app config read/write behavior for non-secret settings.
- Add a secret-storage boundary that defines how tokens/API keys/encryption material will be stored without putting secrets in SQLite plaintext.
- Add storage path resolution for app data, database files, migrations, backups, logs, and exports.
- Add tests for database initialization, migration idempotency, config read/write, and secret-storage boundary behavior.

## Capabilities

### New Capabilities

- `local-persistence`: Defines local database initialization, migrations, repository access, config persistence, storage paths, and secret-storage boundaries for Codex Manager.

### Modified Capabilities

- None.

## Impact

- Affected code: `src/storage`, `src/services/config`, shared storage/config types, tests, and package dependencies for SQLite/migration support if needed.
- Affected systems: app configuration, storage initialization, future account/quota/switching/proxy/backup persistence.
- No account pool, quota fetching, account switching, proxy routing, or backup snapshot behavior is implemented in this change.
