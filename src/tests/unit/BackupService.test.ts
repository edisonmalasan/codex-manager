import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { AccountService } from '../../services/account/AccountService';
import {
  BackupFileMissingError,
  BackupService,
} from '../../services/backup/BackupService';
import { ConfigService } from '../../services/config/ConfigService';
import { AccountRepository } from '../../storage/account/AccountRepository';
import { BackupRepository } from '../../storage/backup/BackupRepository';
import { ConfigRepository } from '../../storage/config/ConfigRepository';
import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';
import { initializeDatabase } from '../../storage/sqlite/database';
import { createTempStoragePaths } from './storage-test-utils';

function createBackupFixture() {
  const paths = createTempStoragePaths();
  const database = initializeDatabase(paths);

  runMigrations(database, defaultMigrations);

  const secretStorage = new InMemorySecretStorage();
  const accountService = new AccountService(
    new AccountRepository(database),
    secretStorage,
  );
  const configService = new ConfigService(new ConfigRepository(database));
  const backupService = new BackupService(
    new BackupRepository(database),
    accountService,
    configService,
    paths,
  );

  return {
    accountService,
    backupService,
    configService,
    database,
    paths,
    secretStorage,
  };
}

describe('BackupService', () => {
  it('creates and lists metadata snapshots', async () => {
    const { accountService, backupService, configService, database } =
      createBackupFixture();

    await accountService.create({
      provider: 'openai',
      label: 'Primary',
      email: 'primary@example.com',
      secret: 'super-secret',
    });
    configService.set('proxy', 'port', 14555);

    const snapshot = backupService.create({ label: 'Before switch' });

    expect(snapshot).toMatchObject({
      label: 'Before switch',
      kind: 'manual',
      payloadVersion: 1,
      accountCount: 1,
      configCount: 1,
      restoredAt: null,
    });
    expect(fs.existsSync(snapshot.filePath)).toBe(true);
    expect(backupService.list()).toHaveLength(1);

    database.close();
  });

  it('does not include raw secrets in the backup payload', async () => {
    const { accountService, backupService, database } = createBackupFixture();

    await accountService.create({
      provider: 'openai',
      label: 'Secret Account',
      secret: 'raw-token-value',
    });

    const snapshot = backupService.create();
    const payloadText = fs.readFileSync(snapshot.filePath, 'utf8');

    expect(payloadText).toContain('"hasSecret": true');
    expect(payloadText).not.toContain('raw-token-value');
    expect(payloadText).not.toContain('secretRef');

    database.close();
  });

  it('restores account metadata through account import', async () => {
    const { accountService, backupService, database } = createBackupFixture();

    const account = await accountService.create({
      provider: 'openai',
      label: 'Restorable',
      email: 'restore@example.com',
      status: 'active',
    });
    const snapshot = backupService.create({ label: 'Restore point' });

    await accountService.delete(account.id);
    expect(accountService.list()).toEqual([]);

    const result = backupService.restore(snapshot.id);

    expect(result.accounts.imported).toHaveLength(1);
    expect(accountService.list()[0]).toMatchObject({
      provider: 'openai',
      label: 'Restorable',
      email: 'restore@example.com',
      status: 'active',
    });
    expect(result.snapshot.restoredAt).not.toBeNull();

    database.close();
  });

  it('deletes backup files and index records', async () => {
    const { backupService, database } = createBackupFixture();
    const snapshot = backupService.create({ label: 'Delete me' });

    expect(fs.existsSync(snapshot.filePath)).toBe(true);
    expect(backupService.delete(snapshot.id)).toBe(true);
    expect(fs.existsSync(snapshot.filePath)).toBe(false);
    expect(backupService.list()).toEqual([]);
    expect(backupService.delete(snapshot.id)).toBe(false);

    database.close();
  });

  it('raises a clear error when restore file is missing', () => {
    const { backupService, database } = createBackupFixture();
    const snapshot = backupService.create({ label: 'Missing file' });

    fs.unlinkSync(snapshot.filePath);

    expect(() => backupService.restore(snapshot.id)).toThrow(
      BackupFileMissingError,
    );

    database.close();
  });

  it('deletes the index record even if the file is already gone', () => {
    const { backupService, database } = createBackupFixture();
    const snapshot = backupService.create({ label: 'Already gone' });

    fs.unlinkSync(snapshot.filePath);

    expect(backupService.delete(snapshot.id)).toBe(true);
    expect(backupService.list()).toEqual([]);

    database.close();
  });
});
