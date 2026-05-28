import { describe, expect, it } from 'vitest';

import { ConfigService } from '../../services/config/ConfigService';
import { ConfigRepository } from '../../storage/config/ConfigRepository';
import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { initializeDatabase } from '../../storage/sqlite/database';
import { createTempStoragePaths } from './storage-test-utils';

describe('ConfigRepository', () => {
  it('writes, reads, updates, and deletes namespaced config values', () => {
    const database = initializeDatabase(createTempStoragePaths());
    runMigrations(database, defaultMigrations);

    const configService = new ConfigService(new ConfigRepository(database));

    configService.set('proxy', 'port', 14555);
    expect(configService.get<number>('proxy', 'port')).toBe(14555);

    configService.set('proxy', 'port', 16666);
    expect(configService.get<number>('proxy', 'port')).toBe(16666);

    expect(configService.get<number>('quota', 'port')).toBeNull();
    expect(configService.delete('proxy', 'port')).toBe(true);
    expect(configService.get<number>('proxy', 'port')).toBeNull();

    database.close();
  });

  it('round-trips object config values', () => {
    const database = initializeDatabase(createTempStoragePaths());
    runMigrations(database, defaultMigrations);

    const repository = new ConfigRepository(database);

    repository.set('ui', 'dashboard', {
      compact: true,
      columns: ['account', 'quota', 'status'],
    });

    expect(repository.get('ui', 'dashboard')).toEqual({
      compact: true,
      columns: ['account', 'quota', 'status'],
    });

    database.close();
  });
});
