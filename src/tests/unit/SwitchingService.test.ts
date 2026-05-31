import { describe, expect, it } from 'vitest';

import { AccountService } from '../../services/account/AccountService';
import { BackupService } from '../../services/backup/BackupService';
import { ConfigService } from '../../services/config/ConfigService';
import {
  SwitchRollbackError,
  SwitchingService,
  SwitchValidationError,
} from '../../services/switching/SwitchingService';
import { AccountRepository } from '../../storage/account/AccountRepository';
import { BackupRepository } from '../../storage/backup/BackupRepository';
import { ConfigRepository } from '../../storage/config/ConfigRepository';
import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';
import { initializeDatabase } from '../../storage/sqlite/database';
import { SwitchingRepository } from '../../storage/switching/SwitchingRepository';
import { createTempStoragePaths } from './storage-test-utils';

function createSwitchingFixture() {
  const paths = createTempStoragePaths();
  const database = initializeDatabase(paths);

  runMigrations(database, defaultMigrations);

  const accountService = new AccountService(
    new AccountRepository(database),
    new InMemorySecretStorage(),
  );
  const configService = new ConfigService(new ConfigRepository(database));
  const backupService = new BackupService(
    new BackupRepository(database),
    accountService,
    configService,
    paths,
  );
  const switchingService = new SwitchingService(
    new SwitchingRepository(database),
    accountService,
    backupService,
  );

  return {
    accountService,
    backupService,
    database,
    switchingService,
  };
}

describe('SwitchingService', () => {
  it('switches the active account and records history', async () => {
    const { accountService, database, switchingService } =
      createSwitchingFixture();
    const account = await accountService.create({
      provider: 'openai',
      label: 'Primary',
    });

    const result = await switchingService.switchAccount({
      targetAccountId: account.id,
      reason: 'manual test',
    });

    expect(result.state).toMatchObject({
      currentAccountId: account.id,
      lastSwitchId: result.history.id,
    });
    expect(result.history).toMatchObject({
      sourceAccountId: null,
      targetAccountId: account.id,
      backupId: result.backup.id,
      status: 'success',
      reason: 'manual test',
      errorMessage: null,
    });
    expect(accountService.list()[0].lastUsedAt).toBe(result.history.completedAt);

    database.close();
  });

  it('creates a backup before changing active account state', async () => {
    const { accountService, backupService, database, switchingService } =
      createSwitchingFixture();
    const account = await accountService.create({
      provider: 'openai',
      label: 'Backup Target',
    });

    const result = await switchingService.switchAccount({
      targetAccountId: account.id,
    });

    expect(backupService.list()).toHaveLength(1);
    expect(backupService.list()[0].id).toBe(result.backup.id);
    expect(result.history.backupId).toBe(result.backup.id);

    database.close();
  });

  it('lists switch history from newest to oldest', async () => {
    const { accountService, database, switchingService } =
      createSwitchingFixture();
    const first = await accountService.create({
      provider: 'openai',
      label: 'First',
    });
    const second = await accountService.create({
      provider: 'openai',
      label: 'Second',
    });

    const firstSwitch = await switchingService.switchAccount({
      targetAccountId: first.id,
    });
    const secondSwitch = await switchingService.switchAccount({
      targetAccountId: second.id,
    });

    expect(switchingService.listHistory().map((entry) => entry.id)).toEqual([
      secondSwitch.history.id,
      firstSwitch.history.id,
    ]);

    database.close();
  });

  it('rolls back the latest successful switch to the previous account', async () => {
    const { accountService, database, switchingService } =
      createSwitchingFixture();
    const first = await accountService.create({
      provider: 'openai',
      label: 'First',
    });
    const second = await accountService.create({
      provider: 'openai',
      label: 'Second',
    });

    await switchingService.switchAccount({ targetAccountId: first.id });
    const secondSwitch = await switchingService.switchAccount({
      targetAccountId: second.id,
    });

    const rollback = await switchingService.rollback();

    expect(rollback.state.currentAccountId).toBe(first.id);
    expect(rollback.history).toMatchObject({
      id: secondSwitch.history.id,
      status: 'rolled_back',
      sourceAccountId: first.id,
      targetAccountId: second.id,
    });
    expect(rollback.history.rolledBackAt).not.toBeNull();

    database.close();
  });

  it('records rollback failure when the previous account is missing', async () => {
    const { accountService, database, switchingService } =
      createSwitchingFixture();
    const first = await accountService.create({
      provider: 'openai',
      label: 'First',
    });
    const second = await accountService.create({
      provider: 'openai',
      label: 'Second',
    });

    await switchingService.switchAccount({ targetAccountId: first.id });
    const secondSwitch = await switchingService.switchAccount({
      targetAccountId: second.id,
    });
    await accountService.delete(first.id);

    await expect(switchingService.rollback()).rejects.toThrow(
      SwitchRollbackError,
    );

    expect(switchingService.getState().currentAccountId).toBe(second.id);
    expect(switchingService.listHistory()[0]).toMatchObject({
      id: secondSwitch.history.id,
      status: 'rollback_failed',
    });
    expect(switchingService.listHistory()[0].errorMessage).toContain(first.id);

    database.close();
  });

  it('rejects missing and disabled target accounts before switching', async () => {
    const { accountService, backupService, database, switchingService } =
      createSwitchingFixture();
    const disabled = await accountService.create({
      provider: 'openai',
      label: 'Disabled',
      status: 'disabled',
    });

    await expect(
      switchingService.switchAccount({ targetAccountId: 'missing' }),
    ).rejects.toThrow(SwitchValidationError);
    await expect(
      switchingService.switchAccount({ targetAccountId: disabled.id }),
    ).rejects.toThrow(SwitchValidationError);

    expect(switchingService.getState().currentAccountId).toBeNull();
    expect(backupService.list()).toEqual([]);
    expect(switchingService.listHistory()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          targetAccountId: 'missing',
          status: 'failed',
        }),
        expect.objectContaining({
          targetAccountId: disabled.id,
          status: 'failed',
        }),
      ]),
    );

    database.close();
  });
});
