import type { Migration } from './Migration';

export const backupSnapshotsMigration: Migration = {
  id: '003-backup-snapshots',
  description: 'Create backup snapshot index table',
  up(database) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS backup_snapshots (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        kind TEXT NOT NULL,
        payload_version INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        restored_at TEXT,
        account_count INTEGER NOT NULL,
        config_count INTEGER NOT NULL,
        CHECK (kind IN ('manual'))
      );

      CREATE INDEX IF NOT EXISTS idx_backup_snapshots_created_at
        ON backup_snapshots(created_at);
    `);
  },
};
