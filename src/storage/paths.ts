import fs from 'node:fs';
import path from 'node:path';

export interface StoragePaths {
  appDataDir: string;
  databaseFile: string;
  logsDir: string;
  backupsDir: string;
  exportsDir: string;
  tempDir: string;
}

export interface AppPathSource {
  getPath: (name: 'userData') => string;
}

export function resolveStoragePaths(app: AppPathSource): StoragePaths {
  return createStoragePaths(app.getPath('userData'));
}

export function createStoragePaths(appDataDir: string): StoragePaths {
  return {
    appDataDir,
    databaseFile: path.join(appDataDir, 'codex-manager.sqlite3'),
    logsDir: path.join(appDataDir, 'logs'),
    backupsDir: path.join(appDataDir, 'backups'),
    exportsDir: path.join(appDataDir, 'exports'),
    tempDir: path.join(appDataDir, 'tmp'),
  };
}

export function ensureStorageDirectories(paths: StoragePaths): void {
  for (const dir of [
    paths.appDataDir,
    paths.logsDir,
    paths.backupsDir,
    paths.exportsDir,
    paths.tempDir,
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
