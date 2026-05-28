import type {
  AccountExportRecord,
  AccountImportRecord,
  AccountImportResult,
  AccountResource,
  CreateAccountInput,
  UpdateAccountInput,
} from './account/account';
import type { AppInfo, HealthStatus } from './ipc/contracts';

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
}

declare global {
  interface Window {
    codexManager: CodexManagerBridge;
  }
}
