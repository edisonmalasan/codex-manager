import { app } from 'electron';
import type { Database } from 'better-sqlite3';

import { DatabaseService } from '../services/database/DatabaseService';
import { resolveStoragePaths } from '../storage/paths';

let database: Database | null = null;

export function initializeMainProcessPersistence(): Database {
  if (database) {
    return database;
  }

  database = new DatabaseService().initialize(resolveStoragePaths(app));

  return database;
}

export function getMainProcessDatabase(): Database {
  return initializeMainProcessPersistence();
}
