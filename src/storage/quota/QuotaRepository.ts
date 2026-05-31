import type { Database } from 'better-sqlite3';

import type {
  QuotaHealthState,
  QuotaSnapshot,
} from '../../shared/quota/quota';
import { DEFAULT_LOW_QUOTA_THRESHOLD } from '../../shared/quota/quota';

interface QuotaRow {
  account_id: string;
  health: QuotaHealthState;
  remaining_quota: number | null;
  quota_limit: number | null;
  percent_remaining: number | null;
  reset_at: string | null;
  refreshed_at: string | null;
  stale_after: string | null;
  low_quota_threshold: number;
  error_message: string | null;
  updated_at: string;
}

export interface QuotaRecordInput {
  accountId: string;
  health: QuotaHealthState;
  remainingQuota: number | null;
  quotaLimit: number | null;
  percentRemaining: number | null;
  resetAt: string | null;
  refreshedAt: string | null;
  staleAfter: string | null;
  lowQuotaThreshold: number;
  errorMessage: string | null;
  updatedAt: string;
}

export class QuotaRepository {
  constructor(private readonly database: Database) {}

  public upsert(snapshot: QuotaRecordInput): QuotaSnapshot {
    this.database
      .prepare(
        `
        INSERT INTO quota_snapshots (
          account_id,
          health,
          remaining_quota,
          quota_limit,
          percent_remaining,
          reset_at,
          refreshed_at,
          stale_after,
          low_quota_threshold,
          error_message,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(account_id)
        DO UPDATE SET
          health = excluded.health,
          remaining_quota = excluded.remaining_quota,
          quota_limit = excluded.quota_limit,
          percent_remaining = excluded.percent_remaining,
          reset_at = excluded.reset_at,
          refreshed_at = excluded.refreshed_at,
          stale_after = excluded.stale_after,
          low_quota_threshold = excluded.low_quota_threshold,
          error_message = excluded.error_message,
          updated_at = excluded.updated_at
      `,
      )
      .run(
        snapshot.accountId,
        snapshot.health,
        snapshot.remainingQuota,
        snapshot.quotaLimit,
        snapshot.percentRemaining,
        snapshot.resetAt,
        snapshot.refreshedAt,
        snapshot.staleAfter,
        snapshot.lowQuotaThreshold,
        snapshot.errorMessage,
        snapshot.updatedAt,
      );

    return toQuotaSnapshot(toQuotaRow(snapshot));
  }

  public list(now = new Date()): QuotaSnapshot[] {
    return (
      this.database
        .prepare(
          `
          SELECT *
          FROM quota_snapshots
          ORDER BY updated_at DESC, account_id ASC
        `,
        )
        .all() as QuotaRow[]
    ).map((row) => toQuotaSnapshot(row, now));
  }

  public getByAccountId(
    accountId: string,
    now = new Date(),
  ): QuotaSnapshot | null {
    const row = this.database
      .prepare('SELECT * FROM quota_snapshots WHERE account_id = ?')
      .get(accountId) as QuotaRow | undefined;

    return row ? toQuotaSnapshot(row, now) : null;
  }

  public getThreshold(accountId: string): number | null {
    const row = this.database
      .prepare(
        'SELECT low_quota_threshold FROM quota_snapshots WHERE account_id = ?',
      )
      .get(accountId) as Pick<QuotaRow, 'low_quota_threshold'> | undefined;

    return row?.low_quota_threshold ?? null;
  }

  public setThreshold(
    accountId: string,
    lowQuotaThreshold: number,
    updatedAt: string,
  ): QuotaSnapshot {
    this.database
      .prepare(
        `
        INSERT INTO quota_snapshots (
          account_id,
          health,
          low_quota_threshold,
          updated_at
        )
        VALUES (?, 'unknown', ?, ?)
        ON CONFLICT(account_id)
        DO UPDATE SET
          low_quota_threshold = excluded.low_quota_threshold,
          updated_at = excluded.updated_at
      `,
      )
      .run(accountId, lowQuotaThreshold, updatedAt);

    const snapshot = this.getByAccountId(accountId);

    if (!snapshot) {
      throw new Error(`Quota threshold update failed for account: ${accountId}`);
    }

    return snapshot;
  }
}

function toQuotaRow(snapshot: QuotaRecordInput): QuotaRow {
  return {
    account_id: snapshot.accountId,
    health: snapshot.health,
    remaining_quota: snapshot.remainingQuota,
    quota_limit: snapshot.quotaLimit,
    percent_remaining: snapshot.percentRemaining,
    reset_at: snapshot.resetAt,
    refreshed_at: snapshot.refreshedAt,
    stale_after: snapshot.staleAfter,
    low_quota_threshold: snapshot.lowQuotaThreshold,
    error_message: snapshot.errorMessage,
    updated_at: snapshot.updatedAt,
  };
}

function toQuotaSnapshot(row: QuotaRow, now = new Date()): QuotaSnapshot {
  return {
    accountId: row.account_id,
    health: row.health,
    remainingQuota: row.remaining_quota,
    quotaLimit: row.quota_limit,
    percentRemaining: row.percent_remaining,
    resetAt: row.reset_at,
    refreshedAt: row.refreshed_at,
    staleAfter: row.stale_after,
    isStale: isStale(row.stale_after, now),
    lowQuotaThreshold:
      row.low_quota_threshold ?? DEFAULT_LOW_QUOTA_THRESHOLD,
    errorMessage: row.error_message,
    updatedAt: row.updated_at,
  };
}

function isStale(staleAfter: string | null, now: Date): boolean {
  if (!staleAfter) {
    return true;
  }

  return Date.parse(staleAfter) <= now.getTime();
}
