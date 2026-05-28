import type { Database } from 'better-sqlite3';

import type { Migration } from './Migration';

interface MigrationRow {
  id: string;
}

export function runMigrations(database: Database, migrations: Migration[]): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = new Set(
    database
      .prepare('SELECT id FROM schema_migrations')
      .all()
      .map((row) => (row as MigrationRow).id),
  );

  const applyMigration = database.transaction((migration: Migration) => {
    migration.up(database);
    database
      .prepare(
        'INSERT INTO schema_migrations (id, description) VALUES (?, ?)',
      )
      .run(migration.id, migration.description);
  });

  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      continue;
    }

    applyMigration(migration);
    applied.add(migration.id);
  }
}
