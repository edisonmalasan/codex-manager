## Context

Codex Manager now has app foundation, local persistence, and an account/resource system. The backup system is the next safety layer because switching and future local Codex config mutation must be able to preserve and restore known-good state.

This change implements backups for current app-owned state only: account metadata and non-secret app config. Raw secrets are not serialized into backup files.

## Goals / Non-Goals

**Goals:**

- Persist a backup snapshot index in SQLite.
- Store snapshot payloads as JSON files under the resolved backups directory.
- Capture account metadata through `AccountService.exportMetadata`.
- Capture non-secret config records from `app_config`.
- Restore account metadata through `AccountService.importMetadata`.
- Delete backup files and index rows together.
- Expose backup operations through typed IPC/preload methods.
- Cover behavior with tests.

**Non-Goals:**

- Back up raw secrets, tokens, API keys, refresh tokens, or encryption keys.
- Back up or mutate real Codex local config files.
- Implement switch-before-backup automation.
- Encrypt backup files.
- Implement backup retention policies.
- Implement UI screens beyond typed bridge support.

## Decisions

1. Backup files are metadata-only JSON.
   - Rationale: readable, testable, and safe while secrets remain out of scope.
   - Alternative: encrypted binary archives. Deferred until secret/config backup requirements are known.

2. SQLite stores the backup index.
   - Rationale: the app needs quick list/delete/restore lookup without scanning the filesystem.
   - Alternative: derive index from files only. Rejected because later retention and status metadata need structure.

3. Restore imports account metadata through account service.
   - Rationale: restore should reuse validation and dedupe behavior already owned by the account system.
   - Alternative: write account rows directly. Rejected because it bypasses domain rules.

4. Local Codex config backup is deferred.
   - Rationale: final Codex config paths and mutation strategy are not implemented yet.
   - Alternative: invent config file paths now. Rejected to avoid unsafe assumptions.

## Risks / Trade-offs

- Backups do not include secrets yet -> Mitigation: document this explicitly and expose `hasSecret` metadata only.
- Restore currently covers account metadata, not full environment state -> Mitigation: keep payload versioned so future config/secret backup can extend it.
- Backup file/index can drift if files are manually deleted -> Mitigation: restore detects missing files and delete tolerates missing files.

## Migration Plan

1. Add a backup snapshot index migration.
2. Add shared backup types and versioned payload contracts.
3. Add backup repository and service.
4. Add backup IPC/preload methods.
5. Add tests and verification.

Rollback before release is straightforward: remove backup modules and migration. After release, use migrations rather than deleting the backup table.

## Open Questions

- Final Codex local config paths are deferred until switching/process integration.
- Backup encryption is deferred until secret-storage production backend is selected.
- Retention policy is deferred to a settings/backup follow-up.
