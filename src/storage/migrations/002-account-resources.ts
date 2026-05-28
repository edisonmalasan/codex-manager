import type { Migration } from './Migration';

export const accountResourcesMigration: Migration = {
  id: '002-account-resources',
  description: 'Create account resource metadata table',
  up(database) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS account_resources (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        label TEXT NOT NULL,
        email TEXT,
        avatar_url TEXT,
        status TEXT NOT NULL,
        secret_service TEXT,
        secret_account TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_used_at TEXT,
        last_refreshed_at TEXT,
        CHECK (status IN (
          'active',
          'low_quota',
          'rate_limited',
          'expired',
          'invalid',
          'disabled',
          'unknown'
        ))
      );

      CREATE INDEX IF NOT EXISTS idx_account_resources_provider
        ON account_resources(provider);

      CREATE INDEX IF NOT EXISTS idx_account_resources_status
        ON account_resources(status);

      CREATE UNIQUE INDEX IF NOT EXISTS idx_account_resources_identity
        ON account_resources(provider, email, label);
    `);
  },
};
