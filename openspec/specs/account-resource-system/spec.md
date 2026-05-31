# account-resource-system Specification

## Purpose
TBD - created by archiving change implement-account-resource-system. Update Purpose after archive.
## Requirements
### Requirement: Account Model

The system SHALL define a Codex account/resource model with stable id, provider, label, optional email/avatar, status, timestamps, and optional secret reference metadata. Quota refresh flows SHALL update the account last refreshed timestamp. Successful account switching SHALL update the target account last used timestamp.

#### Scenario: Account metadata is represented

- **WHEN** an account is created or read
- **THEN** it SHALL expose safe metadata without raw token, API key, or refresh-token values

#### Scenario: Quota refresh updates account freshness

- **WHEN** quota refresh succeeds or records a refresh health result
- **THEN** the account last refreshed timestamp SHALL reflect the quota refresh time

#### Scenario: Switching updates account usage

- **WHEN** an account becomes active through manual switching
- **THEN** the target account last used timestamp SHALL reflect the switch time

### Requirement: Account Status States

The system SHALL restrict account status to known states: `active`, `low_quota`, `rate_limited`, `expired`, `invalid`, `disabled`, and `unknown`. Quota refresh flows SHALL update account status from derived quota health states while preserving validation of unsupported states.

#### Scenario: Invalid status is provided

- **WHEN** account input includes an unsupported status
- **THEN** the account operation SHALL reject the input

#### Scenario: Quota refresh updates account status

- **WHEN** quota refresh derives a supported health state for an account
- **THEN** the account status SHALL be updated to the matching supported status

### Requirement: Account CRUD

The system SHALL support adding, listing, updating, and deleting account/resource records.

#### Scenario: Account lifecycle

- **WHEN** an account is added, updated, listed, and deleted
- **THEN** each operation SHALL reflect the latest persisted account metadata

### Requirement: Secret Reference Handling

The system SHALL store account secret values through the secret-storage boundary and store only secret references in account metadata.

#### Scenario: Account is created with a secret

- **WHEN** an account is added with secret material
- **THEN** the secret SHALL be written through `SecretStorage`
- **THEN** account metadata SHALL include only a secret reference and not the raw secret value

### Requirement: Metadata Import Export

The system SHALL support importing and exporting account pool metadata without raw secrets. Backup creation SHALL use account metadata export, and backup restore SHALL use account metadata import.

#### Scenario: Accounts are exported

- **WHEN** accounts are exported
- **THEN** the export SHALL include metadata and secret reference presence only
- **THEN** the export SHALL NOT include raw secret values

#### Scenario: Accounts are imported

- **WHEN** account metadata is imported
- **THEN** valid accounts SHALL be inserted or updated
- **THEN** invalid account entries SHALL be reported without stopping valid entries from importing

#### Scenario: Account metadata is backed up and restored

- **WHEN** backup creation or restore needs account metadata
- **THEN** it SHALL use the account service metadata export and import paths

### Requirement: Account IPC

The system SHALL expose account/resource operations through typed preload and IPC methods rather than renderer direct database access.

#### Scenario: Renderer requests account list

- **WHEN** renderer code lists accounts
- **THEN** it SHALL use the approved preload account API backed by main-process IPC handlers

