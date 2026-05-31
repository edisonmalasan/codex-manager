## Context

Codex Manager already has account metadata, local persistence, typed IPC, and metadata-only backups. Quota monitoring is the next domain layer because future switching and dashboard workflows need a trusted, persisted view of each account's quota health and freshness.

This change implements app-owned quota state only. It does not call OpenAI/Codex provider APIs yet; instead, refresh calls accept explicit quota readings from the trusted main-process path so UI and future adapters can exercise the full storage/status pipeline.

## Goals / Non-Goals

**Goals:**

- Persist the latest quota snapshot per account.
- Support manual refresh for one account.
- Support batch refresh for multiple accounts.
- Track fresh/stale timestamps.
- Derive health states from refresh input, errors, and low quota thresholds.
- Update account `status` and `lastRefreshedAt` when quota refresh succeeds or fails.
- Expose typed IPC/preload operations for quota workflows.
- Cover quota behavior with unit tests.

**Non-Goals:**

- Background polling or scheduling.
- Real provider API integration or Codex config scraping.
- Automatic account switching.
- Notifications.
- Renderer dashboard UI beyond typed bridge support.

## Decisions

1. Quota snapshots are stored separately from account records.
   - Rationale: quota data changes frequently and has fields that should not bloat account metadata.
   - Alternative: add quota columns directly to `account_resources`. Rejected because future quota history/adapters would make the account table too broad.

2. Manual refresh accepts a normalized reading object.
   - Rationale: this tests and ships the account/status/freshness pipeline before provider-specific integrations are known.
   - Alternative: hard-code OpenAI network calls now. Rejected because secret storage and provider contracts are still placeholder-level.

3. Health state is derived in the service.
   - Rationale: UI and IPC callers should not duplicate status rules.
   - Alternative: let callers pass final account status. Rejected because status derivation needs consistent thresholds and error mapping.

4. Low quota threshold is per account with a default fallback.
   - Rationale: accounts/resources may have different quota shapes later.
   - Alternative: only global settings. Deferred until app settings and operational UI mature.

## Risks / Trade-offs

- Placeholder refresh readings do not prove real provider integration -> Mitigation: keep the provider adapter boundary deferred and test the service contract thoroughly.
- Only latest snapshot is persisted -> Mitigation: the schema can add quota history later without changing the current read path.
- Threshold units can vary by provider -> Mitigation: store remaining/limit as normalized numeric values and derive percentage when possible.

## Migration Plan

1. Add shared quota contracts.
2. Add a quota snapshot migration and repository.
3. Implement quota service refresh/list/threshold logic.
4. Add typed IPC/preload methods.
5. Add tests and verification.

Rollback before release is straightforward: remove quota modules and migration. After release, future schema changes should use migrations.

## Open Questions

- Provider-specific quota adapters are deferred.
- Dashboard UI for quota monitoring is deferred.
- Global default threshold settings are deferred until settings UI exists.
