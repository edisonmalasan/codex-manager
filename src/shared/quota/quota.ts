export const QUOTA_HEALTH_STATES = [
  'active',
  'low_quota',
  'rate_limited',
  'expired',
  'invalid',
  'unknown',
] as const;

export type QuotaHealthState = (typeof QUOTA_HEALTH_STATES)[number];

export const DEFAULT_LOW_QUOTA_THRESHOLD = 20;

export interface QuotaSnapshot {
  accountId: string;
  health: QuotaHealthState;
  remainingQuota: number | null;
  quotaLimit: number | null;
  percentRemaining: number | null;
  resetAt: string | null;
  refreshedAt: string | null;
  staleAfter: string | null;
  isStale: boolean;
  lowQuotaThreshold: number;
  errorMessage: string | null;
  updatedAt: string;
}

export interface QuotaRefreshReading {
  remainingQuota?: number | null;
  quotaLimit?: number | null;
  resetAt?: string | null;
  staleAfter?: string | null;
  lowQuotaThreshold?: number | null;
  health?: QuotaHealthState;
  errorMessage?: string | null;
}

export interface RefreshQuotaInput {
  accountId: string;
  reading: QuotaRefreshReading;
}

export interface BatchRefreshQuotaInput {
  readings: RefreshQuotaInput[];
}

export interface QuotaRefreshResult {
  accountId: string;
  snapshot: QuotaSnapshot;
}

export interface QuotaRefreshError {
  accountId: string;
  message: string;
}

export interface BatchRefreshQuotaResult {
  refreshed: QuotaRefreshResult[];
  errors: QuotaRefreshError[];
}

export interface SetQuotaThresholdInput {
  accountId: string;
  lowQuotaThreshold: number;
}

export function isQuotaHealthState(value: unknown): value is QuotaHealthState {
  return (
    typeof value === 'string' &&
    QUOTA_HEALTH_STATES.includes(value as QuotaHealthState)
  );
}
