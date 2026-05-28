import crypto from 'node:crypto';

import type {
  AccountExportRecord,
  AccountImportRecord,
  AccountImportResult,
  AccountResource,
  AccountStatus,
  CreateAccountInput,
  UpdateAccountInput,
} from '../../shared/account/account';
import { isAccountStatus } from '../../shared/account/account';
import type { AccountRepository } from '../../storage/account/AccountRepository';
import type {
  SecretReference,
  SecretStorage,
} from '../../storage/secrets/SecretStorage';

export class AccountValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountValidationError';
  }
}

export class AccountNotFoundError extends Error {
  constructor(id: string) {
    super(`Account was not found: ${id}`);
    this.name = 'AccountNotFoundError';
  }
}

export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly secretStorage: SecretStorage,
  ) {}

  public async create(input: CreateAccountInput): Promise<AccountResource> {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const secretRef = createSecretReference(id, input.secret ?? null);

    const account = this.accountRepository.create({
      id,
      provider: validateRequiredText(input.provider, 'provider'),
      label: validateRequiredText(input.label, 'label'),
      email: normalizeOptionalText(input.email ?? null),
      avatarUrl: normalizeOptionalText(input.avatarUrl ?? null),
      status: validateStatus(input.status ?? 'unknown'),
      secretRef,
      createdAt: now,
      updatedAt: now,
      lastUsedAt: null,
      lastRefreshedAt: null,
    });

    if (secretRef && input.secret) {
      await this.secretStorage.setSecret(secretRef, input.secret);
    }

    return account;
  }

  public list(): AccountResource[] {
    return this.accountRepository.list();
  }

  public async update(
    id: string,
    input: UpdateAccountInput,
  ): Promise<AccountResource> {
    const existing = this.getRequiredAccount(id);
    const secretRef =
      input.secret !== undefined
        ? createSecretReference(existing.id, input.secret)
        : existing.secretRef;

    const updated: AccountResource = {
      ...existing,
      provider:
        input.provider !== undefined
          ? validateRequiredText(input.provider, 'provider')
          : existing.provider,
      label:
        input.label !== undefined
          ? validateRequiredText(input.label, 'label')
          : existing.label,
      email:
        input.email !== undefined
          ? normalizeOptionalText(input.email)
          : existing.email,
      avatarUrl:
        input.avatarUrl !== undefined
          ? normalizeOptionalText(input.avatarUrl)
          : existing.avatarUrl,
      status: input.status ?? existing.status,
      secretRef,
      updatedAt: new Date().toISOString(),
      lastUsedAt:
        input.lastUsedAt !== undefined ? input.lastUsedAt : existing.lastUsedAt,
      lastRefreshedAt:
        input.lastRefreshedAt !== undefined
          ? input.lastRefreshedAt
          : existing.lastRefreshedAt,
    };

    if (!isAccountStatus(updated.status)) {
      throw new AccountValidationError(`Unsupported status: ${updated.status}`);
    }

    if (input.secret !== undefined) {
      if (secretRef && input.secret) {
        await this.secretStorage.setSecret(secretRef, input.secret);
      } else if (existing.secretRef) {
        await this.secretStorage.deleteSecret(existing.secretRef);
      }
    }

    return this.accountRepository.update(updated);
  }

  public async delete(id: string): Promise<boolean> {
    const existing = this.accountRepository.getById(id);

    if (!existing) {
      return false;
    }

    const deleted = this.accountRepository.delete(id);

    if (deleted && existing.secretRef) {
      await this.secretStorage.deleteSecret(existing.secretRef);
    }

    return deleted;
  }

  public exportMetadata(): AccountExportRecord[] {
    return this.accountRepository.list().map((account) => ({
      id: account.id,
      provider: account.provider,
      label: account.label,
      email: account.email,
      avatarUrl: account.avatarUrl,
      status: account.status,
      hasSecret: Boolean(account.secretRef),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      lastUsedAt: account.lastUsedAt,
      lastRefreshedAt: account.lastRefreshedAt,
    }));
  }

  public importMetadata(records: AccountImportRecord[]): AccountImportResult {
    const imported: AccountResource[] = [];
    const errors: AccountImportResult['errors'] = [];

    records.forEach((record, index) => {
      try {
        imported.push(this.importRecord(record));
      } catch (error) {
        errors.push({
          index,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });

    return { imported, errors };
  }

  private importRecord(record: AccountImportRecord): AccountResource {
    const now = new Date().toISOString();
    const provider = validateRequiredText(record.provider, 'provider');
    const label = validateRequiredText(record.label, 'label');
    const email = normalizeOptionalText(record.email ?? null);
    const status = validateStatus(record.status ?? 'unknown');
    const existing = record.id
      ? this.accountRepository.getById(record.id)
      : this.accountRepository.findByIdentity(provider, email, label);

    const account = {
      id: existing?.id ?? record.id ?? crypto.randomUUID(),
      provider,
      label,
      email,
      avatarUrl: normalizeOptionalText(record.avatarUrl ?? null),
      status,
      secretRef: existing?.secretRef ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      lastUsedAt: existing?.lastUsedAt ?? null,
      lastRefreshedAt: existing?.lastRefreshedAt ?? null,
    };

    return this.accountRepository.upsert(account);
  }

  private getRequiredAccount(id: string): AccountResource {
    const account = this.accountRepository.getById(id);

    if (!account) {
      throw new AccountNotFoundError(id);
    }

    return account;
  }
}

function createSecretReference(
  accountId: string,
  secret: string | null | undefined,
): SecretReference | null {
  if (!secret) {
    return null;
  }

  return {
    service: 'codex-manager-account',
    account: accountId,
  };
}

function validateRequiredText(value: string, field: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new AccountValidationError(`${field} is required`);
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

function validateStatus(status: AccountStatus): AccountStatus {
  if (!isAccountStatus(status)) {
    throw new AccountValidationError(`Unsupported status: ${status}`);
  }

  return status;
}
