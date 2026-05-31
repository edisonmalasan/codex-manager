import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { initializeDatabase } from '../../storage/sqlite/database';
import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { createTempStoragePaths } from './storage-test-utils';

interface TableRow {
  name: string;
}

interface CountRow {
  count: number;
}

describe('database initialization', () => {
  it('creates the database file and base tables', () => {
    const paths = createTempStoragePaths();
    const database = initializeDatabase(paths);

    runMigrations(database, defaultMigrations);

    const tables = database
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
      )
      .all() as TableRow[];

    expect(fs.existsSync(paths.databaseFile)).toBe(true);
    expect(tables.map((table) => table.name)).toEqual([
      'account_resources',
      'app_config',
      'backup_snapshots',
      'schema_migrations',
    ]);

    database.close();
  });

  it('runs migrations idempotently', () => {
    const paths = createTempStoragePaths();
    const database = initializeDatabase(paths);

    runMigrations(database, defaultMigrations);
    runMigrations(database, defaultMigrations);

    const migrationCount = database
      .prepare('SELECT COUNT(*) as count FROM schema_migrations')
      .get() as CountRow;

    expect(migrationCount.count).toBe(defaultMigrations.length);

    database.close();
  });
});
