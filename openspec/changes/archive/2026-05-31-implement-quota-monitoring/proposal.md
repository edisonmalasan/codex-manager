## Why

Codex Manager needs quota visibility before it can safely switch accounts, warn about exhaustion, or automate account health decisions. The first quota slice should provide explicit manual refresh flows and durable freshness/health metadata without making live provider integrations a hard dependency yet.

## What Changes

- Add quota snapshot contracts for account health, quota state, freshness, stale timestamps, and low quota thresholds.
- Persist latest quota snapshots per account.
- Implement manual account refresh and batch refresh service flows.
- Map refresh results into account health/status states such as active, low quota, rate limited, expired, invalid, and unknown.
- Expose typed IPC/preload methods for refresh, batch refresh, quota lookup, and threshold updates.
- Add tests for manual refresh, batch refresh, freshness, stale detection, threshold behavior, and status updates.

## Capabilities

### New Capabilities

- `quota-monitoring`: Defines manual and batch quota refresh, health state derivation, freshness metadata, stale detection, and low quota thresholds.

### Modified Capabilities

- `account-resource-system`: Account health/status and last refreshed timestamps are updated by quota refresh flows.
- `app-foundation`: Quota operations are exposed through the established typed IPC/preload foundation.
- `local-persistence`: Quota snapshots and thresholds are stored behind repository/service boundaries.

## Impact

- Affected code: shared quota contracts, storage migration/repository, quota service, account service integration, IPC handlers, preload API, and tests.
- Affected systems: account status, quota monitoring, future switching, future dashboard views, and persistence.
- No automatic background polling, provider network calls, real Codex quota scraping, or switching automation is implemented in this change.
