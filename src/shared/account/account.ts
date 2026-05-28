import type { SecretReference } from '../secrets/secret-reference';

export const ACCOUNT_STATUSES = [
  'active',
  'low_quota',
  'rate_limited',
  'expired',
  'invalid',
  'disabled',
  'unknown',
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export interface AccountResource {
  id: string;
  provider: string;
  label: string;
  email: string | null;
  avatarUrl: string | null;
  status: AccountStatus;
  secretRef: SecretReference | null;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
  lastRefreshedAt: string | null;
}

export interface CreateAccountInput {
  provider: string;
  label: string;
  email?: string | null;
  avatarUrl?: string | null;
  status?: AccountStatus;
  secret?: string | null;
}

export interface UpdateAccountInput {
  provider?: string;
  label?: string;
  email?: string | null;
  avatarUrl?: string | null;
  status?: AccountStatus;
  secret?: string | null;
  lastUsedAt?: string | null;
  lastRefreshedAt?: string | null;
}

export interface AccountExportRecord {
  id: string;
  provider: string;
  label: string;
  email: string | null;
  avatarUrl: string | null;
  status: AccountStatus;
  hasSecret: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
  lastRefreshedAt: string | null;
}

export interface AccountImportRecord {
  id?: string;
  provider: string;
  label: string;
  email?: string | null;
  avatarUrl?: string | null;
  status?: AccountStatus;
}

export interface AccountImportResult {
  imported: AccountResource[];
  errors: Array<{
    index: number;
    message: string;
  }>;
}

export function isAccountStatus(value: unknown): value is AccountStatus {
  return (
    typeof value === 'string' &&
    ACCOUNT_STATUSES.includes(value as AccountStatus)
  );
}
