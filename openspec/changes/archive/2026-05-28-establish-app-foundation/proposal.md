## Why

Codex Manager currently starts from a minimal Electron Forge + Vite seed, but the planned AntigravityManager-style product needs a scalable application foundation before account, quota, switching, backup, proxy, and process-control systems are added. Establishing the app shell, typed boundaries, and verification scripts now prevents later features from landing in ad hoc files.

## What Changes

- Introduce the target source layout for main, preload, renderer, shared contracts, IPC, services, storage, server, and tests.
- Add a secure Electron app foundation with explicit main/preload/renderer boundaries.
- Add a React renderer shell suitable for the future operational dashboard.
- Add a typed IPC foundation with domain-oriented routing and validated request/response patterns.
- Add baseline service and storage boundaries without implementing account/quota/proxy persistence yet.
- Add development verification scripts for type checking and tests.
- Add initial unit/integration/e2e test harness structure where practical.

## Capabilities

### New Capabilities

- `app-foundation`: Defines the baseline application architecture, secure Electron boundaries, typed IPC pattern, renderer shell, verification scripts, and test harness required before domain systems are implemented.

### Modified Capabilities

- None.

## Impact

- Affected code: Electron entrypoints, renderer bootstrap, preload bridge, source folder structure, package scripts, TypeScript config, and test configuration.
- Affected systems: application architecture, IPC conventions, development workflow, verification workflow.
- Future systems unblocked: account pool, quota monitoring, switching, backups, proxy server, process control, tray integration, and secure persistence.
- No provider-specific account logic, quota fetching, switching mutation, local proxy routing, or database schema is included in this change.
