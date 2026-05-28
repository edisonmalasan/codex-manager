import type { Database } from 'better-sqlite3';

import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { openAppDatabase } from '../../storage/sqlite/database';
import type { StoragePaths } from '../../storage/paths';

export class DatabaseService {
  public initialize(paths: StoragePaths): Database {
    const database = openAppDatabase(paths.databaseFile);
    runMigrations(database, defaultMigrations);

    return database;
  }
}
