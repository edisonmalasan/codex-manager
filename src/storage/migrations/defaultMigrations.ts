import { appConfigMigration } from './001-app-config';
import { accountResourcesMigration } from './002-account-resources';
import { backupSnapshotsMigration } from './003-backup-snapshots';
import { quotaSnapshotsMigration } from './004-quota-snapshots';
import { switchingMigration } from './005-switching';
import type { Migration } from './Migration';

export const defaultMigrations: Migration[] = [
  appConfigMigration,
  accountResourcesMigration,
  backupSnapshotsMigration,
  quotaSnapshotsMigration,
  switchingMigration,
];
