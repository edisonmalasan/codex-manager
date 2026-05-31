## 1. Proposal

- [x] 1.1 Add OpenSpec proposal, design, specs, and task list.
- [x] 1.2 Commit the OpenSpec proposal artifacts.

## 2. Storage And Contracts

- [x] 2.1 Add shared quota types, health states, refresh inputs, and results.
- [x] 2.2 Add quota snapshot migration and include it in default migrations.
- [x] 2.3 Add quota repository for upsert, list, get, and threshold updates.
- [x] 2.4 Commit the storage and contract slice.

## 3. Service

- [x] 3.1 Replace the placeholder quota service with manual refresh behavior.
- [x] 3.2 Implement batch refresh with per-account success and error results.
- [x] 3.3 Derive health from readings, terminal states, and low quota thresholds.
- [x] 3.4 Update account status and last refreshed timestamps during refresh.
- [x] 3.5 Commit the service slice.

## 4. IPC And Preload

- [ ] 4.1 Add quota IPC channels and handlers.
- [ ] 4.2 Extend preload API with typed quota methods.
- [ ] 4.3 Register quota handlers.
- [ ] 4.4 Commit the IPC/preload slice.

## 5. Tests

- [ ] 5.1 Add tests for manual refresh and quota listing.
- [ ] 5.2 Add tests for batch refresh partial success.
- [ ] 5.3 Add tests for health derivation and low quota thresholds.
- [ ] 5.4 Add tests for stale/fresh timestamp behavior.
- [ ] 5.5 Add migration initialization coverage for quota tables.
- [ ] 5.6 Commit the test slice.

## 6. Verification And Archive

- [ ] 6.1 Run `npm run type-check`.
- [ ] 6.2 Run `npm run lint`.
- [ ] 6.3 Run `npm test`.
- [ ] 6.4 Run `npm run package`.
- [ ] 6.5 Confirm OpenSpec status recognizes all artifacts and tasks.
- [ ] 6.6 Archive the OpenSpec change after verification.
- [ ] 6.7 Commit the OpenSpec archive/spec sync.
