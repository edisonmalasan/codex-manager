## Implementation

- [x] Add shared backup types and versioned snapshot payload contracts.
- [x] Add backup snapshot metadata migration and include it in default migrations.
- [x] Add backup repository for create/list/get/mark-restored/delete.
- [x] Replace the placeholder backup service with create/list/restore/delete behavior.
- [x] Capture account metadata and non-secret config state in snapshot files.
- [x] Restore account metadata through account service import.
- [x] Add backup IPC handlers and register backup channels.
- [x] Extend preload API with typed backup methods.
- [x] Add tests for backup creation/listing.
- [x] Add tests for restore behavior.
- [x] Add tests for delete and missing-file behavior.
- [x] Add tests proving backup payloads do not contain raw secrets.
- [x] Run verification commands and document limitations.

## Verification

- [x] Run `npm run type-check`.
- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run package`.
- [x] Confirm OpenSpec status recognizes all artifacts for this change.

## Limitations

- Backups are metadata-only and intentionally exclude raw secrets.
- Backups do not yet capture or mutate real Codex local config files.
- Backup encryption and retention policies are deferred follow-up changes.
