# Codex Manager Agent Guide

Codex Manager is an Electron desktop app modeled directly after AntigravityManager, adapted for the Codex ecosystem. Its purpose is to manage Codex accounts/resources, monitor quota and health, switch accounts safely, expose a local API proxy for development tools, and protect local configuration state.

Use this file as the first source of truth when acting as an assistant in this repo.

## Product Direction

Codex Manager should track AntigravityManager's product shape closely:

- Multi-account pool for Codex-related accounts/resources.
- Real-time account health and quota monitoring.
- Smart account switching when the current account is exhausted, rate-limited, expired, or unhealthy.
- Secure backup and restore of local Codex account/config state.
- Local API proxy with developer-friendly compatibility endpoints.
- Process control for detecting, launching, closing, and restarting Codex-related local tools.
- Tray/background mode, notifications, import/export, compact account views, and operational settings.

Copy AntigravityManager's core systems and architecture patterns where they fit. Rename and adapt the domain from Antigravity/Gemini/Claude to Codex/OpenAI-compatible resources instead of replacing the product with a generic workspace dashboard.

## Architecture Rules

- Electron main process owns trusted system work: filesystem access, process control, account state reads/writes, secure storage, local proxy server lifecycle, quota polling, auto-switching, notifications, tray integration, and persistence.
- Renderer owns UI only: dashboards, account cards, quota views, proxy settings, backup views, status indicators, and user interaction.
- Preload is a narrow bridge. It exposes typed, minimal APIs and never exposes raw `ipcRenderer`, Node APIs, filesystem APIs, shell APIs, or arbitrary command execution.
- Shared types, schemas, and constants must live in shared modules that do not import Electron main or renderer-only code.
- Domain behavior belongs in services, not React components and not IPC handlers directly.
- IPC handlers validate inputs, call services, map errors, and return typed results.
- Long-running work such as quota polling, account refresh, proxy startup, import/export, and switching must have observable status and safe cancellation or recovery behavior.

Recommended future structure:

```plaintext
src/
  main/          Electron lifecycle, windows, menus, tray, app bootstrap
  preload/       Safe bridge APIs exposed to renderer
  renderer/      React UI, routes, layouts, components, hooks
  shared/        Types, schemas, constants, domain contracts
  ipc/           Domain routers and handlers
  services/      Account, quota, switching, proxy, backup, process services
  storage/       SQLite schema, migrations, repositories, encryption helpers
  server/        Local API proxy/gateway service
  tests/         Unit, integration, and e2e tests
docs/            Product and architecture documentation
openspec/        Spec-driven changes and archived decisions
.agents/skills/  Local assistant skills and UI guidance
```

## Electron Security Rules

- Keep `contextIsolation: true`.
- Keep `nodeIntegration: false`.
- Do not enable remote module patterns.
- Do not expose raw IPC channels to renderer code.
- Validate all renderer-provided input with schemas before use.
- Normalize and authorize all local Codex config/account paths before filesystem operations.
- Never execute renderer-provided shell commands directly.
- Process control must use allowlisted executable paths, URI schemes, and lifecycle operations.
- Store tokens, refresh tokens, API keys, proxy credentials, and encryption keys in OS credential storage or encrypted persistence.
- Do not store secrets in localStorage, docs, logs, exported examples, or plaintext JSON.
- Redact secrets and tokens from logs, proxy packet traces, import/export previews, and error reports.
- Back up local account/config state before switching or migration.

## IPC Patterns

Group IPC by domain:

- `account`: local and cloud account records, validation, import/export.
- `quota`: quota refresh, health checks, reset time, usage display.
- `switching`: manual switch, auto-switch, rollback, scheduling guardrails.
- `proxy`: local API proxy status, settings, generated examples, API key lifecycle.
- `backup`: account/config snapshots, restore, delete, verify.
- `process`: detect, launch, close, restart Codex-related tools.
- `config`: app settings, paths, thresholds, language/theme.
- `database`: repositories, migrations, data integrity operations.
- `window` and `tray`: native shell UI.

Use request/response IPC for ordinary data access. Use events or persisted status for quota polling, proxy lifecycle, account switching, imports, exports, and backups. Renderer code should call typed actions/hooks; it should not know low-level channel names.

## React Conventions

- Use React with TypeScript.
- Use local `.agents/skills` for UI and component guidance:
  - `electron`
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`
  - `web-design-guidelines`
- Build the actual manager interface first, not a marketing page.
- Prioritize dense operational dashboards: account pool, quotas, statuses, proxy status, and actions.
- Keep data fetching and IPC-backed state in hooks or action modules.
- Keep presentational components free of IPC and persistence details.
- Prefer composition over boolean prop sprawl.
- Use icons for account actions, refresh, switch, import/export, proxy, settings, backup, and process controls.

## State Management Rules

- Canonical account, quota, proxy, backup, process, and settings state belongs behind services and persistence.
- Renderer should consume canonical async state through query hooks when available.
- Local UI-only state stays in React.
- Persisted settings go through a config/settings service.
- Do not store canonical account state in localStorage.
- Do not store secrets in localStorage.
- Account health and quota status should be cached with timestamps and refreshed through explicit service flows.

## OpenSpec Workflow

OpenSpec is the default workflow for meaningful changes in this repo.

Use OpenSpec when a change affects:

- Product direction or scope.
- Architecture boundaries.
- IPC contracts.
- Persistence schema or migrations.
- Account, quota, switching, proxy, backup, process, or security systems.
- Major UI workflows.
- Security-sensitive behavior.

Small isolated copy edits, styling fixes, tests, and narrow bug fixes may skip OpenSpec. The global `spec` skill may be used for lightweight implementation specs, but OpenSpec owns durable product and architecture changes.

## Git Workflow

For every feature, fix, or refactor:

- Create a dedicated branch:
  - `feat/<name>`
  - `fix/<name>`
  - `refactor/<name>`
- Implement only the scoped OpenSpec task or requested change.
- Verify before commit:
  - `npm run lint`
  - `npm run type-check`
  - `npm test`
  - `npm run package` when Electron/build behavior is affected
- Commit with Conventional Commits using the `git-commit` skill.
- Push the feature branch.
- If implementation is complete and checks pass, merge the branch into `main` and push `main`.
- Do not include unrelated changes or refactors.

For architecture, persistence, IPC, security, or major UI changes:

- Create or update OpenSpec first.
- Implement from its tasks.
- Archive the OpenSpec change only after implementation is verified.

## Development Commands

Use npm because this repo includes `package-lock.json`.

```plaintext
npm start
npm run lint
npm run package
npm run make
```

Add these scripts as the project matures:

```plaintext
npm run type-check
npm test
npm run test:e2e
```

## Documentation Rules

- Keep `docs/architecture.md` aligned with actual architecture decisions.
- Keep `docs/mvp.md` strict so agents do not expand scope accidentally.
- Keep `docs/core-systems.md` as the domain map for account, quota, switching, proxy, backup, process, and storage behavior.
- Update OpenSpec artifacts when changing requirements, not just implementation details.
