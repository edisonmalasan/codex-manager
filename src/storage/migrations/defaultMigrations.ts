import { appConfigMigration } from './001-app-config';
import type { Migration } from './Migration';

export const defaultMigrations: Migration[] = [appConfigMigration];
