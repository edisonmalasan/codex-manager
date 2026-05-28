## Implementation

- [x] Select and install the SQLite persistence dependency compatible with Electron Forge packaging.
- [x] Add storage path resolver for database, logs, backups, exports, and temporary test storage.
- [x] Add database connection/bootstrap module owned by main-process services.
- [x] Add migration runner and migrations table.
- [x] Add initial migration for non-secret app config storage.
- [x] Add config repository/service for namespace/key/value records.
- [x] Add secret-storage interface and test-safe placeholder implementation.
- [x] Add tests for database initialization and migration idempotency.
- [x] Add tests for config read/write behavior.
- [x] Add tests for the secret-storage boundary.
- [x] Run verification commands and document limitations.

## Verification

- [x] Run `npm run type-check`.
- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run package`.
- [x] Confirm OpenSpec status recognizes all artifacts for this change.

Note: `better-sqlite3` was selected for local SQLite persistence and packages successfully with Electron Forge on Windows x64. NPM still reports existing dependency audit findings and a transitive `prebuild-install` deprecation warning; these were not auto-fixed to avoid unrelated dependency churn.
