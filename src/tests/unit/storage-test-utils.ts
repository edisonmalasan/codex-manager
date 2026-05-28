import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { StoragePaths } from '../../storage/paths';
import { createStoragePaths } from '../../storage/paths';

export function createTempStoragePaths(): StoragePaths {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-manager-test-'));

  return createStoragePaths(root);
}
