# app-foundation Specification

## Purpose
TBD - created by archiving change establish-app-foundation. Update Purpose after archive.
## Requirements
### Requirement: Secure Electron Boundary

The application SHALL keep privileged filesystem, process, persistence, proxy, and account/config operations in the Electron main process while exposing only a minimal typed preload bridge to the renderer.

#### Scenario: Renderer requests app information

- **WHEN** renderer code needs app-level information
- **THEN** it SHALL call the approved preload bridge instead of importing Electron, Node, or raw IPC APIs

#### Scenario: Renderer attempts privileged work

- **WHEN** a future UI workflow needs account, quota, switching, backup, proxy, or process behavior
- **THEN** the behavior SHALL be implemented behind main-process IPC handlers and services

### Requirement: Domain-Oriented Source Layout

The application SHALL organize source code into domain and process boundaries that can support account, quota, switching, backup, proxy, process, config, database, and renderer systems.

#### Scenario: Engineer adds a quota feature

- **WHEN** an engineer implements quota monitoring in a future change
- **THEN** there SHALL be clear locations for shared contracts, IPC handlers, services, renderer hooks/actions, and tests

### Requirement: Typed IPC Foundation

The application SHALL provide a typed request/response IPC foundation with shared contracts and domain-oriented routing. Account/resource, backup, and quota operations SHALL use this foundation through typed preload APIs and main-process IPC handlers.

#### Scenario: New IPC endpoint is added

- **WHEN** an endpoint is added for a domain system
- **THEN** its input and output contracts SHALL be defined in shared code and validated before privileged work executes

#### Scenario: Account IPC endpoint is called

- **WHEN** renderer code calls an account operation
- **THEN** the operation SHALL flow through the typed preload bridge and main-process account handlers

#### Scenario: Backup IPC endpoint is called

- **WHEN** renderer code calls a backup operation
- **THEN** the operation SHALL flow through the typed preload bridge and main-process backup handlers

#### Scenario: Quota IPC endpoint is called

- **WHEN** renderer code calls a quota operation
- **THEN** the operation SHALL flow through the typed preload bridge and main-process quota handlers

### Requirement: Renderer App Shell

The application SHALL provide a renderer shell that is ready to host the Codex Manager operational dashboard.

#### Scenario: User opens the app

- **WHEN** the app launches
- **THEN** the renderer SHALL show a working Codex Manager shell rather than the default scaffold console-only page

### Requirement: Verification Scripts

The application SHALL provide standard scripts for type checking and automated tests.

#### Scenario: Assistant completes a future implementation

- **WHEN** an assistant finishes a code change
- **THEN** the assistant SHALL have project scripts available for type checking and tests without inventing verification commands

### Requirement: Domain Behavior Deferral

The application foundation SHALL not implement provider-specific account, quota, switching, backup, proxy routing, or process-control behavior.

#### Scenario: App foundation change is reviewed

- **WHEN** the change is reviewed
- **THEN** reviewers SHALL see architecture and working patterns only, with runtime domain behavior reserved for later OpenSpec changes

