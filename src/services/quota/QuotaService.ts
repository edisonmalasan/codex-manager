import type { AccountStatus } from '../../shared/account/account';
import type {
  BatchRefreshQuotaInput,
  BatchRefreshQuotaResult,
  QuotaHealthState,
  QuotaRefreshReading,
  QuotaRefreshResult,
  QuotaSnapshot,
  RefreshQuotaInput,
  SetQuotaThresholdInput,
} from '../../shared/quota/quota';
import {
  DEFAULT_LOW_QUOTA_THRESHOLD,
  isQuotaHealthState,
} from '../../shared/quota/quota';
import type { AccountService } from '../account/AccountService';
import type { QuotaRepository } from '../../storage/quota/QuotaRepository';

const TERMINAL_HEALTH_STATES = new Set<QuotaHealthState>([
  'rate_limited',
  'expired',
  'invalid',
]);

export class QuotaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuotaValidationError';
  }
}

export class QuotaAccountNotFoundError extends Error {
  constructor(id: string) {
    super(`Account was not found for quota refresh: ${id}`);
    this.name = 'QuotaAccountNotFoundError';
  }
}

export class QuotaService {
  constructor(
    private readonly quotaRepository: QuotaRepository,
    private readonly accountService: AccountService,
  ) {}

  public list(now = new Date()): QuotaSnapshot[] {
    return this.quotaRepository.list(now);
  }

  public get(accountId: string, now = new Date()): QuotaSnapshot | null {
    return this.quotaRepository.getByAccountId(
      validateRequiredText(accountId, 'accountId'),
      now,
    );
  }

  public async refresh(
    input: RefreshQuotaInput,
    now = new Date(),
  ): Promise<QuotaRefreshResult> {
    const accountId = validateRequiredText(input.accountId, 'accountId');

    this.ensureAccountExists(accountId);

    const refreshedAt = now.toISOString();
    const reading = input.reading ?? {};
    const lowQuotaThreshold = resolveThreshold(
      reading.lowQuotaThreshold,
      this.quotaRepository.getThreshold(accountId),
    );
    const remainingQuota = normalizeOptionalNumber(
      reading.remainingQuota ?? null,
      'remainingQuota',
    );
    const quotaLimit = normalizeOptionalNumber(
      reading.quotaLimit ?? null,
      'quotaLimit',
    );
    const percentRemaining = calculatePercentRemaining(
      remainingQuota,
      quotaLimit,
    );
    const health = deriveHealth(reading, percentRemaining, lowQuotaThreshold);
    const staleAfter = normalizeOptionalText(reading.staleAfter ?? null);
    const snapshot = this.quotaRepository.upsert({
      accountId,
      health,
      remainingQuota,
      quotaLimit,
      percentRemaining,
      resetAt: normalizeOptionalText(reading.resetAt ?? null),
      refreshedAt,
      staleAfter,
      lowQuotaThreshold,
      errorMessage: normalizeOptionalText(reading.errorMessage ?? null),
      updatedAt: refreshedAt,
    });

    await this.accountService.update(accountId, {
      status: toAccountStatus(health),
      lastRefreshedAt: refreshedAt,
    });

    return {
      accountId,
      snapshot,
    };
  }

  public async batchRefresh(
    input: BatchRefreshQuotaInput,
    now = new Date(),
  ): Promise<BatchRefreshQuotaResult> {
    const refreshed: QuotaRefreshResult[] = [];
    const errors: BatchRefreshQuotaResult['errors'] = [];

    input.readings.forEach((reading) => {
      try {
        refreshed.push(this.refreshSyncForBatch(reading, now));
      } catch (error) {
        errors.push({
          accountId: reading.accountId,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });

    for (const result of refreshed) {
      await this.accountService.update(result.accountId, {
        status: toAccountStatus(result.snapshot.health),
        lastRefreshedAt: result.snapshot.refreshedAt,
      });
    }

    return { refreshed, errors };
  }

  public setThreshold(input: SetQuotaThresholdInput): QuotaSnapshot {
    const accountId = validateRequiredText(input.accountId, 'accountId');

    this.ensureAccountExists(accountId);

    return this.quotaRepository.setThreshold(
      accountId,
      validateThreshold(input.lowQuotaThreshold),
      new Date().toISOString(),
    );
  }

  private refreshSyncForBatch(
    input: RefreshQuotaInput,
    now: Date,
  ): QuotaRefreshResult {
    const accountId = validateRequiredText(input.accountId, 'accountId');

    this.ensureAccountExists(accountId);

    const refreshedAt = now.toISOString();
    const reading = input.reading ?? {};
    const lowQuotaThreshold = resolveThreshold(
      reading.lowQuotaThreshold,
      this.quotaRepository.getThreshold(accountId),
    );
    const remainingQuota = normalizeOptionalNumber(
      reading.remainingQuota ?? null,
      'remainingQuota',
    );
    const quotaLimit = normalizeOptionalNumber(
      reading.quotaLimit ?? null,
      'quotaLimit',
    );
    const percentRemaining = calculatePercentRemaining(
      remainingQuota,
      quotaLimit,
    );
    const health = deriveHealth(reading, percentRemaining, lowQuotaThreshold);
    const snapshot = this.quotaRepository.upsert({
      accountId,
      health,
      remainingQuota,
      quotaLimit,
      percentRemaining,
      resetAt: normalizeOptionalText(reading.resetAt ?? null),
      refreshedAt,
      staleAfter: normalizeOptionalText(reading.staleAfter ?? null),
      lowQuotaThreshold,
      errorMessage: normalizeOptionalText(reading.errorMessage ?? null),
      updatedAt: refreshedAt,
    });

    return {
      accountId,
      snapshot,
    };
  }

  private ensureAccountExists(accountId: string): void {
    if (!this.accountService.list().some((account) => account.id === accountId)) {
      throw new QuotaAccountNotFoundError(accountId);
    }
  }
}

function deriveHealth(
  reading: QuotaRefreshReading,
  percentRemaining: number | null,
  lowQuotaThreshold: number,
): QuotaHealthState {
  if (reading.health !== undefined && !isQuotaHealthState(reading.health)) {
    throw new QuotaValidationError(`Unsupported quota health: ${reading.health}`);
  }

  if (reading.health && TERMINAL_HEALTH_STATES.has(reading.health)) {
    return reading.health;
  }

  if (normalizeOptionalText(reading.errorMessage ?? null)) {
    return reading.health ?? 'unknown';
  }

  if (percentRemaining !== null) {
    return percentRemaining <= lowQuotaThreshold ? 'low_quota' : 'active';
  }

  return reading.health ?? 'unknown';
}

function calculatePercentRemaining(
  remainingQuota: number | null,
  quotaLimit: number | null,
): number | null {
  if (remainingQuota === null || quotaLimit === null || quotaLimit <= 0) {
    return null;
  }

  return Math.max(0, Math.min(100, (remainingQuota / quotaLimit) * 100));
}

function resolveThreshold(
  inputThreshold: number | null | undefined,
  storedThreshold: number | null,
): number {
  if (inputThreshold !== undefined && inputThreshold !== null) {
    return validateThreshold(inputThreshold);
  }

  return storedThreshold ?? DEFAULT_LOW_QUOTA_THRESHOLD;
}

function validateThreshold(value: number): number {
  const normalized = normalizeRequiredNumber(value, 'lowQuotaThreshold');

  if (normalized < 0 || normalized > 100) {
    throw new QuotaValidationError(
      'lowQuotaThreshold must be between 0 and 100',
    );
  }

  return normalized;
}

function normalizeRequiredNumber(value: number, field: string): number {
  if (!Number.isFinite(value)) {
    throw new QuotaValidationError(`${field} must be a finite number`);
  }

  return value;
}

function normalizeOptionalNumber(
  value: number | null,
  field: string,
): number | null {
  if (value === null) {
    return null;
  }

  return normalizeRequiredNumber(value, field);
}

function validateRequiredText(value: string, field: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new QuotaValidationError(`${field} is required`);
  }

  return normalized;
}

function normalizeOptionalText(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

function toAccountStatus(health: QuotaHealthState): AccountStatus {
  return health;
}
