## MODIFIED Requirements

### Requirement: Repository Boundary

The application SHALL access persisted records through repository/service modules rather than renderer code or ad hoc SQL in UI components. Account/resource records SHALL be persisted through the account repository and account service. Backup snapshot index records SHALL be persisted through the backup repository and backup service. Quota snapshots and thresholds SHALL be persisted through the quota repository and quota service. Switching state and switch history SHALL be persisted through the switching repository and switching service.

#### Scenario: Future feature needs persisted data

- **WHEN** a domain service needs stored records
- **THEN** it SHALL use a repository or storage service owned by the main-process side of the app

#### Scenario: Account system persists metadata

- **WHEN** account metadata is created, updated, listed, imported, exported, or deleted
- **THEN** the operation SHALL go through the account service and repository rather than renderer code or direct UI SQL

#### Scenario: Backup system persists snapshot index

- **WHEN** backup metadata is created, listed, restored, or deleted
- **THEN** the operation SHALL go through the backup service and repository rather than renderer code or direct UI SQL

#### Scenario: Quota system persists snapshots

- **WHEN** quota metadata is refreshed, listed, read, or configured
- **THEN** the operation SHALL go through the quota service and repository rather than renderer code or direct UI SQL

#### Scenario: Switching system persists state

- **WHEN** active account state or switch history is changed, listed, or read
- **THEN** the operation SHALL go through the switching service and repository rather than renderer code or direct UI SQL
