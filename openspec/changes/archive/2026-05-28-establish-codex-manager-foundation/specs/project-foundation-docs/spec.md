## ADDED Requirements

### Requirement: Agent Guidance

The system SHALL provide root-level assistant guidance that defines Codex Manager as a Codex-oriented equivalent of AntigravityManager, including architecture rules, Electron security rules, IPC patterns, React conventions, state management rules, and OpenSpec usage.

#### Scenario: Assistant starts work in the repository

- **WHEN** an assistant reads `AGENTS.md`
- **THEN** the assistant can identify the product as an account/resource manager with quota monitoring, switching, backup, proxy, and process-control systems

### Requirement: Architecture Documentation

The system SHALL provide architecture documentation that describes renderer/main process separation, IPC flow, account/resource model, quota monitoring model, switching model, local proxy architecture, persistence layer, and process/tray architecture.

#### Scenario: Engineer plans a new core system

- **WHEN** an engineer reads `docs/architecture.md`
- **THEN** the engineer can place the feature in the correct process, service, IPC, persistence, and UI boundaries

### Requirement: MVP Scope Control

The system SHALL provide MVP documentation that defines the initial account/resource manager capabilities and explicit non-goals.

#### Scenario: Assistant proposes a feature

- **WHEN** an assistant reads `docs/mvp.md`
- **THEN** the assistant can determine whether the feature belongs in the Codex Manager MVP or should be deferred

### Requirement: Core Systems Documentation

The system SHALL provide core systems documentation for account management, quota monitoring, account switching, backup, local proxying, process control, and project storage.

#### Scenario: Engineer implements a domain service

- **WHEN** an engineer reads `docs/core-systems.md`
- **THEN** the engineer can identify the responsibilities and boundaries of the related system

### Requirement: OpenSpec Workflow

The system SHALL document OpenSpec as the default workflow for durable product, architecture, IPC, persistence, security, and major UI workflow changes.

#### Scenario: Assistant receives a significant change request

- **WHEN** the change affects core systems, IPC, persistence, security, or product direction
- **THEN** the assistant treats OpenSpec as required before implementation
