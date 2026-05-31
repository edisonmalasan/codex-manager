## 1. Proposal

- [x] 1.1 Add OpenSpec proposal, design, specs, and task list.
- [x] 1.2 Commit the OpenSpec proposal artifacts.

## 2. Storage And Contracts

- [x] 2.1 Add shared switching types, switch statuses, inputs, and results.
- [x] 2.2 Add switching state/history migration and include it in default migrations.
- [x] 2.3 Add switching repository for active state, history create/list/get/update, and latest successful lookup.
- [x] 2.4 Commit the storage and contract slice.

## 3. Service

- [x] 3.1 Replace the placeholder switching service with current state/history access.
- [x] 3.2 Implement manual account switch validation.
- [x] 3.3 Implement backup-before-switch behavior.
- [x] 3.4 Update active account state and target account last used timestamp.
- [x] 3.5 Implement rollback/recovery behavior.
- [x] 3.6 Record success, failure, rolled back, and rollback failed history states.
- [x] 3.7 Commit the service slice.

## 4. IPC And Preload

- [x] 4.1 Add switching IPC channels and handlers.
- [x] 4.2 Extend preload API with typed switching methods.
- [x] 4.3 Register switching handlers.
- [x] 4.4 Commit the IPC/preload slice.

## 5. Tests

- [ ] 5.1 Add tests for manual switch and active account state.
- [ ] 5.2 Add tests proving backup is created before switching.
- [ ] 5.3 Add tests for switch history ordering and metadata.
- [ ] 5.4 Add tests for rollback and rollback failure behavior.
- [ ] 5.5 Add tests for missing/disabled target validation.
- [ ] 5.6 Add migration initialization coverage for switching tables.
- [ ] 5.7 Commit the test slice.

## 6. Verification And Archive

- [ ] 6.1 Run `npm run type-check`.
- [ ] 6.2 Run `npm run lint`.
- [ ] 6.3 Run `npm test`.
- [ ] 6.4 Run `npm run package`.
- [ ] 6.5 Confirm OpenSpec status recognizes all artifacts and tasks.
- [ ] 6.6 Archive the OpenSpec change after verification.
- [ ] 6.7 Commit the OpenSpec archive/spec sync.
