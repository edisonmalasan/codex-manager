import type { Migration } from './Migration';

export const quotaSnapshotsMigration: Migration = {
  id: '004-quota-snapshots',
  description: 'Create quota snapshot table',
  up(database) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS quota_snapshots (
        account_id TEXT PRIMARY KEY,
        health TEXT NOT NULL,
        remaining_quota REAL,
        quota_limit REAL,
        percent_remaining REAL,
        reset_at TEXT,
        refreshed_at TEXT,
        stale_after TEXT,
        low_quota_threshold REAL NOT NULL,
        error_message TEXT,
        updated_at TEXT NOT NULL,
        CHECK (health IN ('active', 'low_quota', 'rate_limited', 'expired', 'invalid', 'unknown')),
        CHECK (low_quota_threshold >= 0),
        CHECK (low_quota_threshold <= 100)
      );

      CREATE INDEX IF NOT EXISTS idx_quota_snapshots_health
        ON quota_snapshots(health);

      CREATE INDEX IF NOT EXISTS idx_quota_snapshots_stale_after
        ON quota_snapshots(stale_after);
    `);
  },
};
