import { describe, expect, it } from 'vitest';

import { AccountService } from '../../services/account/AccountService';
import {
  QuotaAccountNotFoundError,
  QuotaService,
  QuotaValidationError,
} from '../../services/quota/QuotaService';
import { AccountRepository } from '../../storage/account/AccountRepository';
import { runMigrations } from '../../storage/migrations/MigrationRunner';
import { defaultMigrations } from '../../storage/migrations/defaultMigrations';
import { QuotaRepository } from '../../storage/quota/QuotaRepository';
import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';
import { initializeDatabase } from '../../storage/sqlite/database';
import { createTempStoragePaths } from './storage-test-utils';

function createQuotaFixture() {
  const database = initializeDatabase(createTempStoragePaths());

  runMigrations(database, defaultMigrations);

  const accountService = new AccountService(
    new AccountRepository(database),
    new InMemorySecretStorage(),
  );
  const quotaService = new QuotaService(
    new QuotaRepository(database),
    accountService,
  );

  return {
    accountService,
    database,
    quotaService,
  };
}

describe('QuotaService', () => {
  it('refreshes one account and lists the latest quota snapshot', async () => {
    const { accountService, database, quotaService } = createQuotaFixture();
    const account = await accountService.create({
      provider: 'openai',
      label: 'Primary',
      status: 'unknown',
    });
    const now = new Date('2026-05-31T10:00:00.000Z');

    const result = await quotaService.refresh(
      {
        accountId: account.id,
        reading: {
          remainingQuota: 80,
          quotaLimit: 100,
          resetAt: '2026-06-01T00:00:00.000Z',
          staleAfter: '2026-05-31T10:15:00.000Z',
        },
      },
      now,
    );

    expect(result.snapshot).toMatchObject({
      accountId: account.id,
      health: 'active',
      remainingQuota: 80,
      quotaLimit: 100,
      percentRemaining: 80,
      isStale: false,
      lowQuotaThreshold: 20,
    });
    expect(quotaService.list(now)).toHaveLength(1);
    expect(accountService.list()[0]).toMatchObject({
      status: 'active',
      lastRefreshedAt: now.toISOString(),
    });

    database.close();
  });

  it('batch refreshes accounts and reports per-account errors', async () => {
    const { accountService, database, quotaService } = createQuotaFixture();
    const first = await accountService.create({
      provider: 'openai',
      label: 'First',
    });
    const second = await accountService.create({
      provider: 'openai',
      label: 'Second',
    });

    const result = await quotaService.batchRefresh({
      readings: [
        {
          accountId: first.id,
          reading: {
            remainingQuota: 90,
            quotaLimit: 100,
          },
        },
        {
          accountId: 'missing-account',
          reading: {
            remainingQuota: 10,
            quotaLimit: 100,
          },
        },
        {
          accountId: second.id,
          reading: {
            health: 'rate_limited',
            errorMessage: '429',
          },
        },
      ],
    });

    expect(result.refreshed.map((entry) => entry.accountId)).toEqual([
      first.id,
      second.id,
    ]);
    expect(result.errors).toEqual([
      {
        accountId: 'missing-account',
        message: 'Account was not found for quota refresh: missing-account',
      },
    ]);
    expect(accountService.list()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: first.id, status: 'active' }),
        expect.objectContaining({ id: second.id, status: 'rate_limited' }),
      ]),
    );

    database.close();
  });

  it('derives low quota health from thresholds', async () => {
    const { accountService, database, quotaService } = createQuotaFixture();
    const account = await accountService.create({
      provider: 'openai',
      label: 'Threshold',
    });

    quotaService.setThreshold({
      accountId: account.id,
      lowQuotaThreshold: 30,
    });

    const result = await quotaService.refresh({
      accountId: account.id,
      reading: {
        remainingQuota: 25,
        quotaLimit: 100,
      },
    });

    expect(result.snapshot).toMatchObject({
      health: 'low_quota',
      percentRemaining: 25,
      lowQuotaThreshold: 30,
    });
    expect(accountService.list()[0].status).toBe('low_quota');

    database.close();
  });

  it('tracks fresh and stale quota timestamps when snapshots are read', async () => {
    const { accountService, database, quotaService } = createQuotaFixture();
    const account = await accountService.create({
      provider: 'openai',
      label: 'Freshness',
    });
    const refreshedAt = new Date('2026-05-31T10:00:00.000Z');

    await quotaService.refresh(
      {
        accountId: account.id,
        reading: {
          remainingQuota: 50,
          quotaLimit: 100,
          staleAfter: '2026-05-31T10:05:00.000Z',
        },
      },
      refreshedAt,
    );

    expect(
      quotaService.get(account.id, new Date('2026-05-31T10:04:59.000Z')),
    ).toMatchObject({
      isStale: false,
    });
    expect(
      quotaService.get(account.id, new Date('2026-05-31T10:05:00.000Z')),
    ).toMatchObject({
      isStale: true,
    });

    database.close();
  });

  it('rejects invalid accounts and thresholds', async () => {
    const { accountService, database, quotaService } = createQuotaFixture();
    const account = await accountService.create({
      provider: 'openai',
      label: 'Invalid',
    });

    await expect(
      quotaService.refresh({
        accountId: 'missing',
        reading: {
          remainingQuota: 1,
          quotaLimit: 10,
        },
      }),
    ).rejects.toThrow(QuotaAccountNotFoundError);

    expect(() =>
      quotaService.setThreshold({
        accountId: account.id,
        lowQuotaThreshold: 101,
      }),
    ).toThrow(QuotaValidationError);

    database.close();
  });
});
