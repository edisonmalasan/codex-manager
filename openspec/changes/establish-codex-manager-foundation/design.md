## Context

The repository currently contains a minimal Electron Forge + Vite TypeScript app. The user wants Codex Manager to copy AntigravityManager's product shape, adapted to the Codex ecosystem.

AntigravityManager's README defines the relevant product pattern: multi-account pool, quota monitoring, intelligent auto-switching, secure encryption, account backup, process control, local API proxy, import/export, notifications, per-account proxy, smart sorting, compact layout, tray support, and modern Electron/React UI.

## Goals / Non-Goals

**Goals:**

- Establish durable assistant guidance for a Codex account/resource manager.
- Document the intended process separation, IPC domains, account model, quota model, switching model, proxy architecture, persistence layer, and process/tray behavior.
- Define an MVP that tracks AntigravityManager's core feature set for Codex Manager.
- Define core systems in behavior-level terms before code grows.

**Non-Goals:**

- Implement runtime account, quota, proxy, backup, switching, or process features in this change.
- Migrate the current source tree.
- Add dependencies.
- Define final database schemas, API credentials, provider wire formats, or IPC payloads.
- Build broad workspace/session/task management unrelated to account/resource management.

## Decisions

1. Codex Manager follows AntigravityManager's product model.
   - Chosen because the desired feature set is explicitly the same product shape: accounts/resources, quota, switching, backup, process control, and local proxy.
   - Alternative: generic workspace/session manager. That was rejected because it does not match the user's intended product.

2. Main process remains the trusted boundary.
   - Chosen because account state, secrets, filesystem mutation, proxy hosting, and process control are security-sensitive.
   - Alternative: expose broader preload APIs for faster UI work. That increases security and maintenance risk.

3. Account/resource management is the core domain.
   - Chosen because quota, switching, proxy routing, backups, and process coordination all depend on a canonical account pool.
   - Alternative: treat accounts as a secondary settings feature. That would make the architecture harder to scale.

4. OpenSpec remains the default durable workflow.
   - Chosen because the app will be built by agent assistants and needs proposal/design/tasks/spec artifacts for cross-session continuity.
   - Alternative: use only lightweight specs. That is faster for small changes but weaker for product-level decisions.

## Risks / Trade-offs

- Codex account/resource APIs and local state details may differ from Antigravity's targets -> Mitigation: keep docs behavior-level until provider-specific implementation specs are written.
- Account and proxy features are security-sensitive -> Mitigation: require encrypted storage, redacted logs, schema validation, backups, and main-process mediation.
- Auto-switching can damage local state if rushed -> Mitigation: require backup-before-switch and conservative switching rules.
- OpenSpec may feel heavy for small edits -> Mitigation: allow isolated copy, style, test, and narrow bug fixes to skip OpenSpec.

## Migration Plan

This change is documentation-only. No runtime migration or rollback is required.

Future runtime work should create focused OpenSpec changes for account storage, quota monitoring, switching, proxy, backup, and process control.

## Open Questions

- Final Codex account source, local config paths, and credential formats are intentionally deferred.
- Final quota/health signal sources are intentionally deferred.
- Final local proxy wire compatibility is intentionally deferred.
- Final database schema and IPC payloads are intentionally deferred.
