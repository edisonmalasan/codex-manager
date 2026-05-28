import { app } from 'electron';

import { AccountService } from '../../services/account/AccountService';
import { BackupService } from '../../services/backup/BackupService';
import { ConfigService } from '../../services/config/ConfigService';
import { AccountRepository } from '../../storage/account/AccountRepository';
import { BackupRepository } from '../../storage/backup/BackupRepository';
import { ConfigRepository } from '../../storage/config/ConfigRepository';
import { resolveStoragePaths } from '../../storage/paths';
import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';
import { getMainProcessDatabase } from '../../main/persistence';

let backupService: BackupService | null = null;

export function getBackupService(): BackupService {
  if (backupService) {
    return backupService;
  }

  const database = getMainProcessDatabase();
  const accountService = new AccountService(
    new AccountRepository(database),
    new InMemorySecretStorage(),
  );

  backupService = new BackupService(
    new BackupRepository(database),
    accountService,
    new ConfigService(new ConfigRepository(database)),
    resolveStoragePaths(app),
  );

  return backupService;
}
