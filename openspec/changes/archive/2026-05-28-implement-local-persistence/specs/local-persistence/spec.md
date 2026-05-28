## ADDED Requirements

### Requirement: Database Initialization

The application SHALL initialize a local SQLite database from the main process using an app-owned storage path.

#### Scenario: App starts with no database

- **WHEN** the persistence layer is initialized for the first time
- **THEN** the database file SHALL be created in the resolved app data location
- **THEN** required base tables SHALL exist after initialization

### Requirement: Migration Runner

The application SHALL run ordered migrations and record completed migrations so they are not applied more than once.

#### Scenario: Migrations run repeatedly

- **WHEN** the migration runner is executed multiple times
- **THEN** already-applied migrations SHALL be skipped
- **THEN** the database schema SHALL remain valid

### Requirement: Repository Boundary

The application SHALL access persisted records through repository/service modules rather than renderer code or ad hoc SQL in UI components.

#### Scenario: Future feature needs persisted data

- **WHEN** a domain service needs stored records
- **THEN** it SHALL use a repository or storage service owned by the main-process side of the app

### Requirement: App Config Persistence

The application SHALL persist non-secret app configuration values through the local persistence layer.

#### Scenario: Config value is saved and read

- **WHEN** a non-secret config value is written
- **THEN** a later read SHALL return the saved value with its namespace/key identity intact

### Requirement: Secret Storage Boundary

The application SHALL define a secret-storage boundary for tokens, API keys, refresh tokens, encryption keys, and proxy credentials.

#### Scenario: Secret value is needed by a future feature

- **WHEN** a future feature needs to store secret material
- **THEN** it SHALL use the secret-storage boundary instead of storing the secret in plaintext SQLite, renderer state, docs, or logs

### Requirement: Storage Path Resolution

The application SHALL centralize path resolution for database files, migrations, logs, backups, exports, and future storage artifacts.

#### Scenario: Service needs a storage path

- **WHEN** a service needs a local storage path
- **THEN** it SHALL request the path from the storage path resolver instead of constructing app data paths independently

### Requirement: Persistence Verification

The application SHALL include automated tests for database initialization, migration idempotency, config read/write behavior, and secret-storage boundary behavior.

#### Scenario: Persistence change is verified

- **WHEN** tests run for this change
- **THEN** persistence foundation behavior SHALL be covered without requiring provider-specific account data
