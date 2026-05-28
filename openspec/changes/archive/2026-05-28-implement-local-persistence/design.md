## Context

The app foundation is in place with secure Electron boundaries, typed IPC, a renderer shell, service boundaries, and tests. The next dependency for AntigravityManager-style features is local persistence: account/resource metadata, quota snapshots, switch history, proxy settings, backup indexes, and app configuration all require a durable and migration-safe storage layer.

This change should create persistence infrastructure only. Domain-specific account, quota, switching, backup, and proxy tables can be added by later OpenSpec changes.

## Goals / Non-Goals

**Goals:**

- Add a SQLite database foundation owned by the main process.
- Add a migration runner that is safe to run repeatedly.
- Add a repository pattern for persistence access.
- Add config storage for non-secret app settings.
- Add path resolution for database, logs, backups, exports, and future artifacts.
- Add a secret-storage boundary that keeps secrets out of plaintext SQLite and renderer state.
- Add tests for initialization, migrations, and config persistence.

**Non-Goals:**

- Implement account/resource storage.
- Implement quota snapshot tables.
- Implement switch history tables.
- Implement backup snapshot creation.
- Implement proxy request persistence.
- Store tokens, refresh tokens, API keys, or encryption keys in plaintext SQLite.
- Expose database access directly to renderer code.

## Decisions

1. Main process owns persistence.
   - Choice: storage modules are used by main-process services and IPC handlers only.
   - Rationale: persistence will eventually include sensitive account and proxy-adjacent data.
   - Alternative: renderer-side IndexedDB/localStorage. Rejected because it is unsuitable for secrets and local system integration.

2. SQLite is the local structured store.
   - Choice: use SQLite for structured app data and filesystem directories for large artifacts.
   - Rationale: the product needs durable local records, queryable state, and simple backup/export behavior.
   - Alternative: JSON files. Rejected because migrations, indexing, and consistency get messy as account/quota/proxy data grows.

3. Migrations are first-class.
   - Choice: every schema change is represented as an ordered migration and recorded in a migrations table.
   - Rationale: future agents must be able to evolve storage safely.
   - Alternative: create tables opportunistically in repositories. Rejected because that hides schema history.

4. Secrets are referenced, not stored directly.
   - Choice: SQLite stores secret references/metadata only; secret material goes through an OS credential/encrypted-storage boundary.
   - Rationale: Codex account/resource management will handle tokens and API keys.
   - Alternative: encrypt all secrets in SQLite immediately. Deferred until provider-specific requirements are known.

## Risks / Trade-offs

- Native SQLite dependency may complicate packaging -> Mitigation: choose a dependency compatible with Electron Forge native rebuilds and verify package/build.
- Migration bugs can corrupt local state -> Mitigation: test migration idempotency and keep migrations small.
- Secret boundary may be too abstract before account implementation -> Mitigation: define a minimal interface and no-op/test implementation first, then bind to OS credential storage later.
- Config schema can sprawl -> Mitigation: keep config records namespaced and schema-validated.

## Migration Plan

1. Add storage path resolution using Electron app paths in main process.
2. Add database connection/bootstrap module.
3. Add migrations table and initial app config migration.
4. Add config repository/service for non-secret settings.
5. Add secret-storage interface and placeholder implementation suitable for tests.
6. Add IPC endpoint only if needed to prove config access; otherwise keep persistence behind services.
7. Add tests and run type-check, lint, unit tests, and package.

Rollback is straightforward while no production data exists: remove the persistence modules, dependency, and generated database files.

## Open Questions

- Final secret backend is deferred until account/resource implementation.
- Final domain table schemas are deferred to account, quota, switching, proxy, and backup changes.
- Final import/export format is deferred until account/resource storage exists.
