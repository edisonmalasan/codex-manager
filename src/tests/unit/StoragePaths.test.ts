import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { ensureStorageDirectories } from '../../storage/paths';
import { createTempStoragePaths } from './storage-test-utils';

describe('storage paths', () => {
  it('creates app-owned storage directories', () => {
    const paths = createTempStoragePaths();

    ensureStorageDirectories(paths);

    expect(fs.existsSync(paths.appDataDir)).toBe(true);
    expect(fs.existsSync(paths.logsDir)).toBe(true);
    expect(fs.existsSync(paths.backupsDir)).toBe(true);
    expect(fs.existsSync(paths.exportsDir)).toBe(true);
    expect(fs.existsSync(paths.tempDir)).toBe(true);
    expect(paths.databaseFile).toBe(
      path.join(paths.appDataDir, 'codex-manager.sqlite3'),
    );
  });
});
