import type { AccountExportRecord, AccountImportResult } from '../account/account';
import type { JsonValue } from '../../storage/config/ConfigRepository';

export const BACKUP_PAYLOAD_VERSION = 1;

export const BACKUP_KINDS = ['manual'] as const;

export type BackupKind = (typeof BACKUP_KINDS)[number];

export interface BackupSnapshot {
  id: string;
  label: string;
  kind: BackupKind;
  payloadVersion: number;
  filePath: string;
  createdAt: string;
  restoredAt: string | null;
  accountCount: number;
  configCount: number;
}

export interface CreateBackupInput {
  label?: string | null;
  kind?: BackupKind;
}

export interface RestoreBackupResult {
  snapshot: BackupSnapshot;
  accounts: AccountImportResult;
}

export interface BackupPayloadConfigRecord {
  namespace: string;
  key: string;
  value: JsonValue;
}

export interface BackupPayload {
  version: typeof BACKUP_PAYLOAD_VERSION;
  createdAt: string;
  accounts: AccountExportRecord[];
  config: BackupPayloadConfigRecord[];
}
