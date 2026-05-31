import type {
  AccountExportRecord,
  AccountImportRecord,
  AccountImportResult,
  AccountResource,
  CreateAccountInput,
  UpdateAccountInput,
} from './account/account';
import type {
  BackupSnapshot,
  CreateBackupInput,
  RestoreBackupResult,
} from './backup/backup';
import type { AppInfo, HealthStatus } from './ipc/contracts';
import type {
  BatchRefreshQuotaInput,
  BatchRefreshQuotaResult,
  QuotaRefreshResult,
  QuotaSnapshot,
  RefreshQuotaInput,
  SetQuotaThresholdInput,
} from './quota/quota';

export interface CodexManagerBridge {
  app: {
    getInfo: () => Promise<AppInfo>;
  };
  health: {
    ping: () => Promise<HealthStatus>;
  };
  accounts: {
    create: (input: CreateAccountInput) => Promise<AccountResource>;
    list: () => Promise<AccountResource[]>;
    update: (
      id: string,
      input: UpdateAccountInput,
    ) => Promise<AccountResource>;
    delete: (id: string) => Promise<boolean>;
    exportMetadata: () => Promise<AccountExportRecord[]>;
    importMetadata: (
      records: AccountImportRecord[],
    ) => Promise<AccountImportResult>;
  };
  backups: {
    create: (input?: CreateBackupInput) => Promise<BackupSnapshot>;
    list: () => Promise<BackupSnapshot[]>;
    restore: (id: string) => Promise<RestoreBackupResult>;
    delete: (id: string) => Promise<boolean>;
  };
  quotas: {
    refresh: (input: RefreshQuotaInput) => Promise<QuotaRefreshResult>;
    batchRefresh: (
      input: BatchRefreshQuotaInput,
    ) => Promise<BatchRefreshQuotaResult>;
    list: () => Promise<QuotaSnapshot[]>;
    get: (accountId: string) => Promise<QuotaSnapshot | null>;
    setThreshold: (
      input: SetQuotaThresholdInput,
    ) => Promise<QuotaSnapshot>;
  };
}

declare global {
  interface Window {
    codexManager: CodexManagerBridge;
  }
}
