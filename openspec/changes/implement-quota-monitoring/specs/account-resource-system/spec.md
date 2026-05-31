## MODIFIED Requirements

### Requirement: Account Status States

The system SHALL restrict account status to known states: `active`, `low_quota`, `rate_limited`, `expired`, `invalid`, `disabled`, and `unknown`. Quota refresh flows SHALL update account status from derived quota health states while preserving validation of unsupported states.

#### Scenario: Invalid status is provided

- **WHEN** account input includes an unsupported status
- **THEN** the account operation SHALL reject the input

#### Scenario: Quota refresh updates account status

- **WHEN** quota refresh derives a supported health state for an account
- **THEN** the account status SHALL be updated to the matching supported status

### Requirement: Account Model

The system SHALL define a Codex account/resource model with stable id, provider, label, optional email/avatar, status, timestamps, and optional secret reference metadata. Quota refresh flows SHALL update the account last refreshed timestamp.

#### Scenario: Account metadata is represented

- **WHEN** an account is created or read
- **THEN** it SHALL expose safe metadata without raw token, API key, or refresh-token values

#### Scenario: Quota refresh updates account freshness

- **WHEN** quota refresh succeeds or records a refresh health result
- **THEN** the account last refreshed timestamp SHALL reflect the quota refresh time
