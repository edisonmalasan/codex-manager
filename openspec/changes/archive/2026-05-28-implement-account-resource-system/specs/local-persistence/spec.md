## MODIFIED Requirements

### Requirement: Repository Boundary

The application SHALL access persisted records through repository/service modules rather than renderer code or ad hoc SQL in UI components. Account/resource records SHALL be persisted through the account repository and account service.

#### Scenario: Future feature needs persisted data

- **WHEN** a domain service needs stored records
- **THEN** it SHALL use a repository or storage service owned by the main-process side of the app

#### Scenario: Account system persists metadata

- **WHEN** account metadata is created, updated, listed, imported, exported, or deleted
- **THEN** the operation SHALL go through the account service and repository rather than renderer code or direct UI SQL
