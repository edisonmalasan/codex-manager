import type { Database } from 'better-sqlite3';

import type {
  SwitchHistoryRecord,
  SwitchState,
  SwitchStatus,
} from '../../shared/switching/switching';

const SWITCH_STATE_ID = 'active';

interface SwitchStateRow {
  current_account_id: string | null;
  last_switch_id: string | null;
  updated_at: string | null;
}

interface SwitchHistoryRow {
  id: string;
  source_account_id: string | null;
  target_account_id: string;
  backup_id: string | null;
  status: SwitchStatus;
  reason: string | null;
  created_at: string;
  completed_at: string | null;
  rolled_back_at: string | null;
  error_message: string | null;
}

export interface SwitchHistoryRecordInput {
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

export interface SwitchHistoryUpdateInput {
  status: SwitchStatus;
  completedAt?: string | null;
  rolledBackAt?: string | null;
  errorMessage?: string | null;
}

export class SwitchingRepository {
  constructor(private readonly database: Database) {}

  public getState(): SwitchState {
    const row = this.database
      .prepare('SELECT * FROM switching_state WHERE id = ?')
      .get(SWITCH_STATE_ID) as SwitchStateRow | undefined;

    return row
      ? toSwitchState(row)
      : {
          currentAccountId: null,
          lastSwitchId: null,
          updatedAt: null,
        };
  }

  public setState(state: SwitchState): SwitchState {
    this.database
      .prepare(
        `
        INSERT INTO switching_state (
          id,
          current_account_id,
          last_switch_id,
          updated_at
        )
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id)
        DO UPDATE SET
          current_account_id = excluded.current_account_id,
          last_switch_id = excluded.last_switch_id,
          updated_at = excluded.updated_at
      `,
      )
      .run(
        SWITCH_STATE_ID,
        state.currentAccountId,
        state.lastSwitchId,
        state.updatedAt,
      );

    return state;
  }

  public createHistory(record: SwitchHistoryRecordInput): SwitchHistoryRecord {
    this.database
      .prepare(
        `
        INSERT INTO switch_history (
          id,
          source_account_id,
          target_account_id,
          backup_id,
          status,
          reason,
          created_at,
          completed_at,
          rolled_back_at,
          error_message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        record.id,
        record.sourceAccountId,
        record.targetAccountId,
        record.backupId,
        record.status,
        record.reason,
        record.createdAt,
        record.completedAt,
        record.rolledBackAt,
        record.errorMessage,
      );

    return record;
  }

  public updateHistory(
    id: string,
    input: SwitchHistoryUpdateInput,
  ): SwitchHistoryRecord | null {
    const existing = this.getHistoryById(id);

    if (!existing) {
      return null;
    }

    this.database
      .prepare(
        `
        UPDATE switch_history
        SET
          status = ?,
          completed_at = ?,
          rolled_back_at = ?,
          error_message = ?
        WHERE id = ?
      `,
      )
      .run(
        input.status,
        input.completedAt !== undefined
          ? input.completedAt
          : existing.completedAt,
        input.rolledBackAt !== undefined
          ? input.rolledBackAt
          : existing.rolledBackAt,
        input.errorMessage !== undefined
          ? input.errorMessage
          : existing.errorMessage,
        id,
      );

    return this.getHistoryById(id);
  }

  public listHistory(): SwitchHistoryRecord[] {
    return (
      this.database
        .prepare(
          `
          SELECT *
          FROM switch_history
          ORDER BY created_at DESC
        `,
        )
        .all() as SwitchHistoryRow[]
    ).map(toSwitchHistoryRecord);
  }

  public getHistoryById(id: string): SwitchHistoryRecord | null {
    const row = this.database
      .prepare('SELECT * FROM switch_history WHERE id = ?')
      .get(id) as SwitchHistoryRow | undefined;

    return row ? toSwitchHistoryRecord(row) : null;
  }

  public getLatestSuccessfulSwitch(): SwitchHistoryRecord | null {
    const row = this.database
      .prepare(
        `
        SELECT *
        FROM switch_history
        WHERE status = 'success'
        ORDER BY completed_at DESC, created_at DESC
        LIMIT 1
      `,
      )
      .get() as SwitchHistoryRow | undefined;

    return row ? toSwitchHistoryRecord(row) : null;
  }
}

function toSwitchState(row: SwitchStateRow): SwitchState {
  return {
    currentAccountId: row.current_account_id,
    lastSwitchId: row.last_switch_id,
    updatedAt: row.updated_at,
  };
}

function toSwitchHistoryRecord(row: SwitchHistoryRow): SwitchHistoryRecord {
  return {
    id: row.id,
    sourceAccountId: row.source_account_id,
    targetAccountId: row.target_account_id,
    backupId: row.backup_id,
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    rolledBackAt: row.rolled_back_at,
    errorMessage: row.error_message,
  };
}
