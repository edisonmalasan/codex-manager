## Implementation

- [ ] Add account/resource shared types, status constants, and input contracts.
- [ ] Add account metadata migration and include it in default migrations.
- [ ] Add account repository for create/list/get/update/delete and import/export support.
- [ ] Replace the placeholder account service with CRUD, import/export, validation, and secret-reference handling.
- [ ] Add account IPC handlers and register account channels.
- [ ] Extend preload API with typed account methods.
- [ ] Add tests for account model validation and status rejection.
- [ ] Add tests for account CRUD behavior.
- [ ] Add tests for account import/export without raw secrets.
- [ ] Add tests for secret handling and secret cleanup on delete.
- [ ] Run verification commands and document limitations.

## Verification

- [ ] Run `npm run type-check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Run `npm run package`.
- [ ] Confirm OpenSpec status recognizes all artifacts for this change.
