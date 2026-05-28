import { appConfigMigration } from './001-app-config';
import { accountResourcesMigration } from './002-account-resources';
import type { Migration } from './Migration';

export const defaultMigrations: Migration[] = [
  appConfigMigration,
  accountResourcesMigration,
];
