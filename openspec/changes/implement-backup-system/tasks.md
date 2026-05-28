## Implementation

- [ ] Add shared backup types and versioned snapshot payload contracts.
- [ ] Add backup snapshot metadata migration and include it in default migrations.
- [ ] Add backup repository for create/list/get/mark-restored/delete.
- [ ] Replace the placeholder backup service with create/list/restore/delete behavior.
- [ ] Capture account metadata and non-secret config state in snapshot files.
- [ ] Restore account metadata through account service import.
- [ ] Add backup IPC handlers and register backup channels.
- [ ] Extend preload API with typed backup methods.
- [ ] Add tests for backup creation/listing.
- [ ] Add tests for restore behavior.
- [ ] Add tests for delete and missing-file behavior.
- [ ] Add tests proving backup payloads do not contain raw secrets.
- [ ] Run verification commands and document limitations.

## Verification

- [ ] Run `npm run type-check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Run `npm run package`.
- [ ] Confirm OpenSpec status recognizes all artifacts for this change.
