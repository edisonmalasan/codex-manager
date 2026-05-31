## MODIFIED Requirements

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
