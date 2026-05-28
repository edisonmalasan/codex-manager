import { describe, expect, it } from 'vitest';

import {
  AccountService,
  AccountValidationError,
} from '../../services/account/AccountService';
import type { AccountStatus } from '../../shared/account/account';
import { AccountRepository } from '../../storage/account/AccountRepository';
import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';
import { initializeDatabase } from '../../storage/sqlite/database';
import { createTempStoragePaths } from './storage-test-utils';

function createAccountService() {
  const database = initializeDatabase(createTempStoragePaths());
  runMigrations(database, defaultMigrations);

  const secretStorage = new InMemorySecretStorage();
  const accountService = new AccountService(
    new AccountRepository(database),
    secretStorage,
  );

  return { accountService, database, secretStorage };
}

describe('AccountService', () => {
  it('creates, lists, updates, and deletes account metadata', async () => {
    const { accountService, database } = createAccountService();

    const created = await accountService.create({
      provider: 'openai',
      label: 'Primary',
      email: 'user@example.com',
      status: 'active',
    });

    expect(accountService.list()).toHaveLength(1);
    expect(accountService.list()[0]).toMatchObject({
      id: created.id,
      provider: 'openai',
      label: 'Primary',
      email: 'user@example.com',
      status: 'active',
    });

    const updated = await accountService.update(created.id, {
      label: 'Primary Codex',
      status: 'disabled',
    });

    expect(updated).toMatchObject({
      label: 'Primary Codex',
      status: 'disabled',
    });

    expect(await accountService.delete(created.id)).toBe(true);
    expect(accountService.list()).toEqual([]);
    expect(await accountService.delete(created.id)).toBe(false);

    database.close();
  });

  it('rejects invalid status values', async () => {
    const { accountService, database } = createAccountService();

    await expect(
      accountService.create({
        provider: 'openai',
        label: 'Invalid',
        status: 'not-real' as AccountStatus,
      }),
    ).rejects.toThrow(AccountValidationError);

    database.close();
  });

  it('stores secrets through the secret storage boundary', async () => {
    const { accountService, database, secretStorage } = createAccountService();

    const account = await accountService.create({
      provider: 'openai',
      label: 'With Secret',
      secret: 'secret-token',
    });

    expect(account.secretRef).toEqual({
      service: 'codex-manager-account',
      account: account.id,
    });
    expect(await secretStorage.getSecret(account.secretRef!)).toBe(
      'secret-token',
    );

    expect(await accountService.delete(account.id)).toBe(true);
    expect(await secretStorage.getSecret(account.secretRef!)).toBeNull();

    database.close();
  });

  it('exports metadata without raw secrets', async () => {
    const { accountService, database } = createAccountService();

    await accountService.create({
      provider: 'openai',
      label: 'Exportable',
      email: 'safe@example.com',
      secret: 'do-not-export',
    });

    const exported = accountService.exportMetadata();

    expect(exported).toHaveLength(1);
    expect(exported[0]).toMatchObject({
      provider: 'openai',
      label: 'Exportable',
      email: 'safe@example.com',
      hasSecret: true,
    });
    expect(JSON.stringify(exported)).not.toContain('do-not-export');
    expect(JSON.stringify(exported)).not.toContain('secretRef');

    database.close();
  });

  it('imports valid metadata and reports invalid records', () => {
    const { accountService, database } = createAccountService();

    const result = accountService.importMetadata([
      {
        provider: 'openai',
        label: 'Imported',
        email: 'imported@example.com',
        status: 'unknown',
      },
      {
        provider: '',
        label: 'Broken',
      },
    ]);

    expect(result.imported).toHaveLength(1);
    expect(result.imported[0]).toMatchObject({
      provider: 'openai',
      label: 'Imported',
      email: 'imported@example.com',
      status: 'unknown',
    });
    expect(result.errors).toEqual([
      {
        index: 1,
        message: 'provider is required',
      },
    ]);

    const updateResult = accountService.importMetadata([
      {
        id: result.imported[0].id,
        provider: 'openai',
        label: 'Imported Updated',
        status: 'disabled',
      },
    ]);

    expect(updateResult.imported[0]).toMatchObject({
      id: result.imported[0].id,
      label: 'Imported Updated',
      status: 'disabled',
    });
    expect(accountService.list()).toHaveLength(1);

    database.close();
  });
});
