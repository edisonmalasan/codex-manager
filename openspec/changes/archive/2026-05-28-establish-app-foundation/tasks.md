## Implementation

- [x] Restructure source files toward the documented app foundation while preserving Electron Forge/Vite startup.
- [x] Configure secure BrowserWindow defaults and development-only DevTools behavior.
- [x] Add a minimal typed preload bridge for approved renderer calls.
- [x] Add shared contracts/schemas for the foundation IPC example.
- [x] Add domain-oriented IPC pattern with a minimal health/app-info endpoint.
- [x] Add service boundary modules for future account, quota, switching, backup, proxy, process, config, database, and storage systems without implementing domain behavior.
- [x] Add a renderer app shell for the future operational dashboard.
- [x] Add or update package scripts for type-checking and tests.
- [x] Add minimal tests for the IPC/service foundation where practical.
- [x] Run verification commands and document any limitations.

## Verification

- [x] Run `npm run type-check`.
- [x] Run `npm run lint`.
- [x] Run `npm test` if the test script is added.
- [x] Run `npm start` or an equivalent startup check when practical.
- [x] Confirm OpenSpec status recognizes all artifacts for this change.

Note: `npm run package` was used as the practical startup/build check because `npm start` opens an interactive Electron process. NPM reported dependency audit findings after installing React/Vitest tooling; these were not auto-fixed because broad audit fixes may introduce unrelated breaking changes.
