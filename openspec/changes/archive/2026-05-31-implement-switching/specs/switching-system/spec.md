## ADDED Requirements

### Requirement: Active Account State

The system SHALL persist the current active account selection as app-owned switching state.

#### Scenario: Current active account is read

- **WHEN** switching state is requested
- **THEN** the system SHALL return the current active account id and last switch metadata when present

### Requirement: Manual Account Switch

The system SHALL support manually switching from the current active account to a requested target account.

#### Scenario: Account is switched manually

- **WHEN** a manual switch receives a valid target account id
- **THEN** the system SHALL make that account the active account
- **THEN** the system SHALL record the previous active account id when one exists

### Requirement: Backup Before Switch

The system SHALL create a backup before changing active account selection during manual switching.

#### Scenario: Switch creates safety backup

- **WHEN** a manual switch is requested
- **THEN** a backup SHALL be created before the active account is changed
- **THEN** the switch history record SHALL reference the backup id

### Requirement: Rollback Recovery

The system SHALL support rolling back the latest successful switch to its previous active account when that account still exists.

#### Scenario: Switch is rolled back

- **WHEN** rollback is requested for a successful switch with a valid previous account
- **THEN** the previous account SHALL become active again
- **THEN** the switch history record SHALL be marked as rolled back

#### Scenario: Rollback cannot recover

- **WHEN** rollback is requested but the previous account is missing
- **THEN** the active account SHALL remain unchanged
- **THEN** the switch history record SHALL include a failed recovery status and error message

### Requirement: Switch History

The system SHALL persist switch history with stable id, source account id, target account id, backup id, status, timestamps, and error message.

#### Scenario: History is listed

- **WHEN** switch history is listed
- **THEN** records SHALL be returned from newest to oldest
- **THEN** records SHALL include enough metadata to audit switch, rollback, and failure outcomes

### Requirement: Switching Validation

The system SHALL reject switches to missing or disabled target accounts.

#### Scenario: Invalid target is requested

- **WHEN** a manual switch targets a missing or disabled account
- **THEN** the switch SHALL fail before changing active account state
- **THEN** the failure SHALL be recorded in switch history

### Requirement: Switching IPC

The system SHALL expose switching operations through typed preload and IPC methods rather than renderer direct filesystem or database access.

#### Scenario: Renderer switches account

- **WHEN** renderer code switches accounts, reads current switch state, rolls back, or lists history
- **THEN** it SHALL use the approved preload switching API backed by main-process handlers
