import type { Database } from 'better-sqlite3';

import type {
  AccountResource,
  AccountStatus,
} from '../../shared/account/account';
import type { SecretReference } from '../secrets/SecretStorage';

interface AccountRow {
  id: string;
  provider: string;
  label: string;
  email: string | null;
  avatar_url: string | null;
  status: AccountStatus;
  secret_service: string | null;
  secret_account: string | null;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
  last_refreshed_at: string | null;
}

export interface AccountRecordInput {
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

export class AccountRepository {
  constructor(private readonly database: Database) {}

  public create(account: AccountRecordInput): AccountResource {
    this.database
      .prepare(
        `
        INSERT INTO account_resources (
          id,
          provider,
          label,
          email,
          avatar_url,
          status,
          secret_service,
          secret_account,
          created_at,
          updated_at,
          last_used_at,
          last_refreshed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        account.id,
        account.provider,
        account.label,
        account.email,
        account.avatarUrl,
        account.status,
        account.secretRef?.service ?? null,
        account.secretRef?.account ?? null,
        account.createdAt,
        account.updatedAt,
        account.lastUsedAt,
        account.lastRefreshedAt,
      );

    return account;
  }

  public upsert(account: AccountRecordInput): AccountResource {
    this.database
      .prepare(
        `
        INSERT INTO account_resources (
          id,
          provider,
          label,
          email,
          avatar_url,
          status,
          secret_service,
          secret_account,
          created_at,
          updated_at,
          last_used_at,
          last_refreshed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id)
        DO UPDATE SET
          provider = excluded.provider,
          label = excluded.label,
          email = excluded.email,
          avatar_url = excluded.avatar_url,
          status = excluded.status,
          secret_service = excluded.secret_service,
          secret_account = excluded.secret_account,
          updated_at = excluded.updated_at,
          last_used_at = excluded.last_used_at,
          last_refreshed_at = excluded.last_refreshed_at
      `,
      )
      .run(
        account.id,
        account.provider,
        account.label,
        account.email,
        account.avatarUrl,
        account.status,
        account.secretRef?.service ?? null,
        account.secretRef?.account ?? null,
        account.createdAt,
        account.updatedAt,
        account.lastUsedAt,
        account.lastRefreshedAt,
      );

    return account;
  }

  public list(): AccountResource[] {
    return (
      this.database
        .prepare(
          `
          SELECT *
          FROM account_resources
          ORDER BY updated_at DESC, label ASC
        `,
        )
        .all() as AccountRow[]
    ).map(toAccountResource);
  }

  public getById(id: string): AccountResource | null {
    const row = this.database
      .prepare('SELECT * FROM account_resources WHERE id = ?')
      .get(id) as AccountRow | undefined;

    return row ? toAccountResource(row) : null;
  }

  public findByIdentity(
    provider: string,
    email: string | null,
    label: string,
  ): AccountResource | null {
    const row = this.database
      .prepare(
        `
        SELECT *
        FROM account_resources
        WHERE provider = ?
          AND label = ?
          AND (
            (email IS NULL AND ? IS NULL)
            OR email = ?
          )
      `,
      )
      .get(provider, label, email, email) as AccountRow | undefined;

    return row ? toAccountResource(row) : null;
  }

  public update(account: AccountResource): AccountResource {
    this.database
      .prepare(
        `
        UPDATE account_resources
        SET
          provider = ?,
          label = ?,
          email = ?,
          avatar_url = ?,
          status = ?,
          secret_service = ?,
          secret_account = ?,
          updated_at = ?,
          last_used_at = ?,
          last_refreshed_at = ?
        WHERE id = ?
      `,
      )
      .run(
        account.provider,
        account.label,
        account.email,
        account.avatarUrl,
        account.status,
        account.secretRef?.service ?? null,
        account.secretRef?.account ?? null,
        account.updatedAt,
        account.lastUsedAt,
        account.lastRefreshedAt,
        account.id,
      );

    return account;
  }

  public delete(id: string): boolean {
    const result = this.database
      .prepare('DELETE FROM account_resources WHERE id = ?')
      .run(id);

    return result.changes > 0;
  }
}

function toAccountResource(row: AccountRow): AccountResource {
  return {
    id: row.id,
    provider: row.provider,
    label: row.label,
    email: row.email,
    avatarUrl: row.avatar_url,
    status: row.status,
    secretRef:
      row.secret_service && row.secret_account
        ? {
            service: row.secret_service,
            account: row.secret_account,
          }
        : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastUsedAt: row.last_used_at,
    lastRefreshedAt: row.last_refreshed_at,
  };
}
