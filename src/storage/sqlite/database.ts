import Database from 'better-sqlite3';

import { ensureStorageDirectories, type StoragePaths } from '../paths';

export function openAppDatabase(databaseFile: string): Database.Database {
  const database = new Database(databaseFile);

  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');

  return database;
}

export function initializeDatabase(paths: StoragePaths): Database.Database {
  ensureStorageDirectories(paths);

  return openAppDatabase(paths.databaseFile);
}
