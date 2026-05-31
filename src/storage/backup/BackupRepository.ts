import type { Database } from 'better-sqlite3';

import type { BackupKind, BackupSnapshot } from '../../shared/backup/backup';

interface BackupRow {
  id: string;
  label: string;
  kind: BackupKind;
  payload_version: number;
  file_path: string;
  created_at: string;
  restored_at: string | null;
  account_count: number;
  config_count: number;
}

export interface BackupRecordInput {
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

export class BackupRepository {
  constructor(private readonly database: Database) {}

  public create(snapshot: BackupRecordInput): BackupSnapshot {
    this.database
      .prepare(
        `
        INSERT INTO backup_snapshots (
          id,
          label,
          kind,
          payload_version,
          file_path,
          created_at,
          restored_at,
          account_count,
          config_count
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        snapshot.id,
        snapshot.label,
        snapshot.kind,
        snapshot.payloadVersion,
        snapshot.filePath,
        snapshot.createdAt,
        snapshot.restoredAt,
        snapshot.accountCount,
        snapshot.configCount,
      );

    return snapshot;
  }

  public list(): BackupSnapshot[] {
    return (
      this.database
        .prepare(
          `
          SELECT *
          FROM backup_snapshots
          ORDER BY created_at DESC
        `,
        )
        .all() as BackupRow[]
    ).map(toBackupSnapshot);
  }

  public getById(id: string): BackupSnapshot | null {
    const row = this.database
      .prepare('SELECT * FROM backup_snapshots WHERE id = ?')
      .get(id) as BackupRow | undefined;

    return row ? toBackupSnapshot(row) : null;
  }

  public markRestored(id: string, restoredAt: string): BackupSnapshot | null {
    this.database
      .prepare('UPDATE backup_snapshots SET restored_at = ? WHERE id = ?')
      .run(restoredAt, id);

    return this.getById(id);
  }

  public delete(id: string): boolean {
    const result = this.database
      .prepare('DELETE FROM backup_snapshots WHERE id = ?')
      .run(id);

    return result.changes > 0;
  }
}

function toBackupSnapshot(row: BackupRow): BackupSnapshot {
  return {
    id: row.id,
    label: row.label,
    kind: row.kind,
    payloadVersion: row.payload_version,
    filePath: row.file_path,
    createdAt: row.created_at,
    restoredAt: row.restored_at,
    accountCount: row.account_count,
    configCount: row.config_count,
  };
}
