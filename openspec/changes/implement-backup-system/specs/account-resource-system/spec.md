## MODIFIED Requirements

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
