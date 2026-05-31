# quota-monitoring Specification

## Purpose
TBD - created by archiving change implement-quota-monitoring. Update Purpose after archive.
## Requirements
### Requirement: Quota Snapshot Model

The system SHALL define quota snapshots with account id, health state, remaining quota, quota limit, reset timestamp, stale/fresh metadata, low quota threshold, and refresh timestamp.

#### Scenario: Quota snapshot is listed

- **WHEN** quota snapshots are listed
- **THEN** each snapshot SHALL expose quota health and freshness metadata without exposing raw account secrets

### Requirement: Manual Quota Refresh

The system SHALL support manually refreshing quota state for a single account.

#### Scenario: Account quota is refreshed

- **WHEN** a manual quota refresh receives a valid account id and quota reading
- **THEN** the latest quota snapshot SHALL be persisted for that account
- **THEN** the account last refreshed timestamp SHALL be updated

### Requirement: Batch Quota Refresh

The system SHALL support refreshing multiple accounts in one operation.

#### Scenario: Multiple accounts are refreshed

- **WHEN** a batch quota refresh receives multiple account readings
- **THEN** each valid account SHALL receive an independent refresh result
- **THEN** failures for one account SHALL NOT prevent other accounts from refreshing

### Requirement: Health State Derivation

The system SHALL derive health states from quota readings, refresh errors, and low quota thresholds.

#### Scenario: Quota is low

- **WHEN** remaining quota is at or below the configured low quota threshold
- **THEN** the snapshot health SHALL be `low_quota`
- **THEN** the account status SHALL be updated to `low_quota`

#### Scenario: Quota is healthy

- **WHEN** remaining quota is above the configured low quota threshold and no refresh error is present
- **THEN** the snapshot health SHALL be `active`
- **THEN** the account status SHALL be updated to `active`

#### Scenario: Refresh reports a terminal health state

- **WHEN** refresh input reports `rate_limited`, `expired`, or `invalid`
- **THEN** the snapshot health SHALL match the reported state
- **THEN** the account status SHALL be updated to the matching state

### Requirement: Freshness And Staleness

The system SHALL track whether quota data is fresh or stale using refresh timestamps and stale-after timestamps.

#### Scenario: Quota snapshot becomes stale

- **WHEN** a quota snapshot's stale-after timestamp is before the current time
- **THEN** the snapshot SHALL be considered stale when it is read

#### Scenario: Quota snapshot is fresh

- **WHEN** a quota snapshot's stale-after timestamp is after the current time
- **THEN** the snapshot SHALL be considered fresh when it is read

### Requirement: Low Quota Thresholds

The system SHALL allow low quota thresholds to be configured per account.

#### Scenario: Threshold is updated

- **WHEN** a low quota threshold is set for an account
- **THEN** future refreshes for that account SHALL use the configured threshold when deriving health state

### Requirement: Quota IPC

The system SHALL expose quota operations through typed preload and IPC methods rather than renderer direct filesystem or database access.

#### Scenario: Renderer refreshes quota

- **WHEN** renderer code refreshes, batch refreshes, lists, reads, or updates quota thresholds
- **THEN** it SHALL use the approved preload quota API backed by main-process handlers

