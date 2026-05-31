## ADDED Requirements

### Requirement: Backup Snapshot Model

The system SHALL define backup snapshots with stable id, label, kind, payload version, file path, creation timestamp, and restore timestamp metadata.

#### Scenario: Backup is listed

- **WHEN** backups are listed
- **THEN** each backup SHALL expose metadata without reading raw secret values

### Requirement: Backup Creation

The system SHALL create metadata-only backup files for current app-owned account/config state.

#### Scenario: Backup is created

- **WHEN** a backup is created
- **THEN** account metadata and non-secret config state SHALL be written to a snapshot file
- **THEN** the backup index SHALL contain the snapshot metadata

### Requirement: Backup Restore

The system SHALL restore account metadata from a backup through the account import path.

#### Scenario: Backup is restored

- **WHEN** a backup snapshot is restored
- **THEN** account metadata SHALL be imported through the account service
- **THEN** the backup index SHALL record the restore timestamp

### Requirement: Backup Deletion

The system SHALL delete backup snapshot files and their index records.

#### Scenario: Backup is deleted

- **WHEN** a backup is deleted
- **THEN** its index record SHALL be removed
- **THEN** its snapshot file SHALL be removed when present

### Requirement: Secret Safe Payload

The system SHALL NOT include raw account secrets, tokens, API keys, refresh tokens, or encryption keys in backup payloads.

#### Scenario: Account has a secret reference

- **WHEN** a backup is created for an account with a secret reference
- **THEN** the snapshot SHALL include only metadata such as `hasSecret`
- **THEN** the snapshot SHALL NOT include raw secret values

### Requirement: Backup IPC

The system SHALL expose backup operations through typed preload and IPC methods rather than renderer direct filesystem or database access.

#### Scenario: Renderer creates backup

- **WHEN** renderer code creates, lists, restores, or deletes backups
- **THEN** it SHALL use the approved preload backup API backed by main-process handlers
