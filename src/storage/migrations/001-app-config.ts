import type { Migration } from './Migration';

export const appConfigMigration: Migration = {
  id: '001-app-config',
  description: 'Create non-secret app configuration table',
  up(database) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS app_config (
        namespace TEXT NOT NULL,
        key TEXT NOT NULL,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (namespace, key)
      );
    `);
  },
};
