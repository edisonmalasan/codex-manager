## Context

The foundation and persistence layers are in place. Account/resource management is now the first real domain system because quota monitoring, switching, proxy routing, and backup behavior all need a canonical account pool.

This change implements account metadata and secure secret-reference handling only. It deliberately does not call external provider APIs, mutate local Codex state, or run a proxy.

## Goals / Non-Goals

**Goals:**

- Add account/resource metadata storage in SQLite.
- Define stable account status states.
- Support add, list, update, and delete operations.
- Support metadata-only import/export.
- Store raw secret values only through the `SecretStorage` boundary.
- Expose account operations through typed IPC/preload APIs.
- Cover behavior with unit tests.

**Non-Goals:**

- Fetch quota from providers.
- Switch active accounts.
- Start or route through a local proxy.
- Create account/config backups.
- Implement OS credential storage backend.
- Persist raw tokens, API keys, or refresh tokens in SQLite.

## Decisions

1. Account metadata is stored in SQLite.
   - Rationale: account lists must be durable, queryable, and future-friendly for quota/switch history joins.
   - Alternative: JSON file account registry. Rejected because it complicates migrations and later queries.

2. Secrets are reference-only in account rows.
   - Rationale: account metadata can be exported safely while secret material stays behind a storage boundary.
   - Alternative: encrypted SQLite secret values now. Deferred until provider-specific secret requirements are known.

3. Import/export is metadata-only.
   - Rationale: export files can be shared/backed up without leaking tokens or API keys.
   - Alternative: include encrypted secrets in export. Deferred to a later backup/export security spec.

4. Account statuses are explicit string states.
   - Rationale: UI, quota, switching, and filtering need stable states even before provider integrations exist.
   - Alternative: free-form status text. Rejected because it weakens validation.

## Risks / Trade-offs

- In-memory secret storage is not production persistence -> Mitigation: expose only an interface and use it in tests; implement OS credential storage in a later security/account-provider change.
- Metadata import may create duplicates -> Mitigation: support deterministic dedupe by id when present and provider/email/label fallback.
- IPC validation is manual for now -> Mitigation: keep contracts small and test service validation; add schema library later if needed.
- Deleting accounts could orphan secrets -> Mitigation: account service deletes the associated secret reference when deleting an account.

## Migration Plan

1. Add an account metadata migration after app config.
2. Add account shared contracts.
3. Add account repository and service.
4. Add typed IPC/preload methods.
5. Add tests for repository/service/import/export/secret behavior.
6. Run lint, type-check, tests, package.

Rollback before release is straightforward: remove account modules and migration. After release, use a follow-up migration instead of deleting account tables.

## Open Questions

- Final Codex/OpenAI provider-specific credential shapes are deferred.
- Final OS credential backend is deferred.
- Final account validation against live services is deferred.
- Final import/export encryption is deferred.
