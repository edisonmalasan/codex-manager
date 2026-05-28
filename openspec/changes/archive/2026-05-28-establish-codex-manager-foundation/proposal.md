## Why

Codex Manager is intended to be a Codex-oriented equivalent of AntigravityManager, not a generic workspace/session dashboard. The foundation docs need to reflect the real product direction: multi-account/resource management, quota monitoring, smart switching, secure backups, local proxying, and local process control.

## What Changes

- Update root assistant guidance in `AGENTS.md` around the AntigravityManager-style product model.
- Update `docs/architecture.md` to center account/resource management, quota polling, switching, backup, proxy, process control, and secure persistence.
- Update `docs/mvp.md` to define an account/resource manager MVP.
- Update `docs/core-systems.md` to define account, quota, switching, backup, proxy, process, and storage systems.
- Keep OpenSpec as the default workflow for durable product and architecture changes.

## Capabilities

### New Capabilities

- `project-foundation-docs`: Defines the documentation and workflow foundation for Codex Manager as a Codex-oriented equivalent of AntigravityManager.

### Modified Capabilities

- None.

## Impact

- Affected files: `AGENTS.md`, `docs/architecture.md`, `docs/mvp.md`, `docs/core-systems.md`, and this OpenSpec change.
- Affected systems: development workflow, assistant guidance, product planning, architecture planning, documentation standards.
- No runtime code, package dependencies, database schema, or IPC contracts are changed by this foundation pass.
