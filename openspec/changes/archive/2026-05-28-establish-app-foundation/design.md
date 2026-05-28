## Context

The current repository contains a simple Electron Forge + Vite scaffold with flat `src/main.ts`, `src/preload.ts`, `src/renderer.ts`, and `src/index.css`. The foundation docs define Codex Manager as a Codex-oriented equivalent of AntigravityManager, which will need secure local account/config access, quota polling, account switching, backups, local proxying, process control, and tray/background operation.

Before those domain systems are implemented, the codebase needs clear boundaries for Electron security, typed IPC, React rendering, shared contracts, services, storage, and verification.

## Goals / Non-Goals

**Goals:**

- Restructure the app toward the documented architecture without adding domain behavior prematurely.
- Keep Electron privileged operations in main process only.
- Expose a minimal secure preload bridge.
- Establish typed IPC/domain routing patterns ready for account, quota, switching, proxy, backup, process, config, and database modules.
- Add a renderer app shell that can become the operational dashboard.
- Add baseline type-check and test scripts so later features can be verified consistently.

**Non-Goals:**

- Implement account/resource storage.
- Implement quota fetching.
- Implement switching or local config mutation.
- Implement local API proxy routing.
- Implement backup/restore behavior.
- Implement process control or tray behavior beyond placeholders needed for architecture.
- Add final database schema or migrations.

## Decisions

1. Use a domain-first source layout.
   - Choice: create folders for `main`, `preload`, `renderer`, `shared`, `ipc`, `services`, `storage`, `server`, and `tests`.
   - Rationale: future systems need clear ownership and should not accumulate in root entrypoints.
   - Alternative: keep flat files until features require refactoring. Rejected because the next features are cross-cutting and security-sensitive.

2. Keep preload intentionally small.
   - Choice: expose only typed bridge functions and never expose raw IPC or Node APIs.
   - Rationale: account credentials, local config mutation, and proxy controls make renderer isolation important from the beginning.
   - Alternative: broad preload convenience API. Rejected because it will become hard to secure later.

3. Establish IPC contracts before domain implementations.
   - Choice: create shared types/schemas and a domain router pattern with placeholder-safe capabilities.
   - Rationale: later features can add account/quota/proxy handlers without inventing a new IPC style each time.
   - Alternative: implement IPC ad hoc per feature. Rejected because it increases drift between agents.

4. Add verification scripts now.
   - Choice: add `type-check`, `test`, and later-compatible e2e script structure.
   - Rationale: future account and proxy logic will need repeatable safety checks.
   - Alternative: wait until domain logic exists. Rejected because agents need a standard verification target before implementation starts.

## Risks / Trade-offs

- Folder migration could break Forge/Vite entrypoint resolution -> Mitigation: keep existing Vite config expectations satisfied or update config in the same change.
- Adding test tooling may require dependency updates -> Mitigation: keep dependencies minimal and aligned with the existing Electron/Vite stack.
- Placeholder modules could become fake architecture -> Mitigation: only add boundaries and minimal working examples, not unused complex abstractions.
- TypeScript version is currently old for modern React patterns -> Mitigation: upgrade only if required by selected dependencies, otherwise keep this change focused.

## Migration Plan

1. Move existing entrypoint behavior into the new folder layout while preserving Electron Forge startup.
2. Add secure BrowserWindow defaults and remove always-open DevTools outside development.
3. Add preload bridge and shared API typing.
4. Add renderer shell with dashboard-ready layout placeholders.
5. Add minimal IPC route such as `app.getInfo` or `health.ping` to prove the pattern.
6. Add scripts/config for type-checking and tests.
7. Run verification commands and update tasks.

Rollback is straightforward: revert the source layout and package/config changes from this change.

## Open Questions

- Final UI component library installation is deferred until the first UI implementation change.
- Final database library and schema are deferred to the persistence change.
- Final local proxy server framework is deferred to the proxy change.
- Final account provider contracts are deferred to the account/resource system change.
