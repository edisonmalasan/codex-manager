## MODIFIED Requirements

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
