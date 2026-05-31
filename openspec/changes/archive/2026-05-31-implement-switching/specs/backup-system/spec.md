## MODIFIED Requirements

### Requirement: Backup Creation

The system SHALL create metadata-only backup files for current app-owned account/config state. Manual account switching SHALL create a backup before active account selection changes.

#### Scenario: Backup is created

- **WHEN** a backup is created
- **THEN** account metadata and non-secret config state SHALL be written to a snapshot file
- **THEN** the backup index SHALL contain the snapshot metadata

#### Scenario: Switching creates backup first

- **WHEN** a manual account switch is requested
- **THEN** a backup SHALL be created before active account state changes
- **THEN** the resulting switch history SHALL reference that backup
