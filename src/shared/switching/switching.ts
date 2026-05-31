import type { BackupSnapshot } from '../backup/backup';

export const SWITCH_STATUSES = [
  'success',
  'failed',
  'rolled_back',
  'rollback_failed',
] as const;

export type SwitchStatus = (typeof SWITCH_STATUSES)[number];

export interface SwitchState {
  currentAccountId: string | null;
  lastSwitchId: string | null;
  updatedAt: string | null;
}

export interface SwitchHistoryRecord {
  id: string;
  sourceAccountId: string | null;
  targetAccountId: string;
  backupId: string | null;
  status: SwitchStatus;
  reason: string | null;
  createdAt: string;
  completedAt: string | null;
  rolledBackAt: string | null;
  errorMessage: string | null;
}

export interface ManualSwitchInput {
  targetAccountId: string;
  reason?: string | null;
}

export interface RollbackSwitchInput {
  switchId?: string | null;
}

export interface SwitchResult {
  state: SwitchState;
  history: SwitchHistoryRecord;
  backup: BackupSnapshot;
}

export interface RollbackSwitchResult {
  state: SwitchState;
  history: SwitchHistoryRecord;
}

export function isSwitchStatus(value: unknown): value is SwitchStatus {
  return (
    typeof value === 'string' &&
    SWITCH_STATUSES.includes(value as SwitchStatus)
  );
}
