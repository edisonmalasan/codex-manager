## Context

Codex Manager now has account metadata, metadata-only backups, quota monitoring, and typed IPC. Switching is the next safety layer: users need to choose which account/resource is active, the app needs an audit trail, and future Codex config mutation must be protected by backups and rollback.

This change implements app-owned active account state only. It does not write real Codex config files or restart Codex processes yet.

## Goals / Non-Goals

**Goals:**

- Persist current active account selection.
- Persist switch history records with source/target account ids, status, backup id, timestamps, and error message.
- Implement manual account switch.
- Create a backup before changing active account selection.
- Update target account `lastUsedAt` during a successful switch.
- Implement rollback to the previous account for a successful switch.
- Record rollback/recovery outcomes.
- Expose typed IPC/preload operations for switching workflows.
- Cover switching behavior with tests.

**Non-Goals:**

- Automatic switching from quota health.
- Real Codex config mutation.
- Process restart/close behavior.
- UI screens beyond typed bridge support.
- Restoring raw secrets or encrypted config state.

## Decisions

1. Active account state is stored in the switching repository.
   - Rationale: switching owns selection and history; account records remain resource metadata.
   - Alternative: add `is_active` to account rows. Rejected because switch history/recovery logic needs a separate transaction log anyway.

2. Switch history stores both source and target ids.
   - Rationale: rollback must know where to recover without inferring from current state.
   - Alternative: store target only. Rejected because rollback would be ambiguous after multiple switch attempts.

3. Backup creation happens before active account mutation.
   - Rationale: the first irreversible step must preserve current app-owned state.
   - Alternative: switch first and then back up. Rejected because it cannot recover the original state if the switch fails.

4. Rollback changes active selection and records a recovery status.
   - Rationale: this gives users a clear audit trail without pretending a full system restore happened.
   - Alternative: call backup restore during rollback. Deferred because current backups are metadata-only and real Codex config mutation is not implemented yet.

## Risks / Trade-offs

- Active account switching does not yet affect real Codex config -> Mitigation: name this as app-owned selection and keep config mutation for a later spec.
- Backup is metadata-only -> Mitigation: still guarantees account/config metadata audit safety and preserves the backup-before-switch invariant.
- Rollback can fail if previous account is deleted -> Mitigation: record failed rollback status and preserve history/error details.

## Migration Plan

1. Add shared switching contracts.
2. Add switching state/history migration and repository.
3. Implement switching service with backup-first manual switch and rollback.
4. Add typed IPC/preload methods.
5. Add tests and verification.

Rollback before release is straightforward: remove switching modules and migration. After release, future schema changes should use migrations.

## Open Questions

- Real Codex config file mutation is deferred to a future config-switching change.
- Process restart and notification behavior are deferred.
- Automatic switch candidate selection from quota health is deferred.
