## Implementation

- [x] Add account/resource shared types, status constants, and input contracts.
- [x] Add account metadata migration and include it in default migrations.
- [x] Add account repository for create/list/get/update/delete and import/export support.
- [x] Replace the placeholder account service with CRUD, import/export, validation, and secret-reference handling.
- [x] Add account IPC handlers and register account channels.
- [x] Extend preload API with typed account methods.
- [x] Add tests for account model validation and status rejection.
- [x] Add tests for account CRUD behavior.
- [x] Add tests for account import/export without raw secrets.
- [x] Add tests for secret handling and secret cleanup on delete.
- [x] Run verification commands and document limitations.

## Verification

- [x] Run `npm run type-check`.
- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run package`.
- [x] Confirm OpenSpec status recognizes all artifacts for this change.

Note: Raw account secrets are stored only through the `SecretStorage` boundary. The current runtime uses the existing in-memory secret storage placeholder; a later security/provider change should bind that interface to OS credential storage before real provider credentials are used.
