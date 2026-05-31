import type { Migration } from './Migration';

export const switchingMigration: Migration = {
  id: '005-switching',
  description: 'Create switching state and history tables',
  up(database) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS switching_state (
        id TEXT PRIMARY KEY CHECK (id = 'active'),
        current_account_id TEXT,
        last_switch_id TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS switch_history (
        id TEXT PRIMARY KEY,
        source_account_id TEXT,
        target_account_id TEXT NOT NULL,
        backup_id TEXT,
        status TEXT NOT NULL,
        reason TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        rolled_back_at TEXT,
        error_message TEXT,
        CHECK (status IN ('success', 'failed', 'rolled_back', 'rollback_failed'))
      );

      CREATE INDEX IF NOT EXISTS idx_switch_history_created_at
        ON switch_history(created_at);

      CREATE INDEX IF NOT EXISTS idx_switch_history_status
        ON switch_history(status);
    `);
  },
};
