import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import type { AccountService } from '../account/AccountService';
import type { ConfigService } from '../config/ConfigService';
import type {
  BackupPayload,
  BackupSnapshot,
  CreateBackupInput,
  RestoreBackupResult,
} from '../../shared/backup/backup';
import { BACKUP_PAYLOAD_VERSION } from '../../shared/backup/backup';
import type { BackupRepository } from '../../storage/backup/BackupRepository';
import type { StoragePaths } from '../../storage/paths';
import { ensureStorageDirectories } from '../../storage/paths';

export class BackupNotFoundError extends Error {
  constructor(id: string) {
    super(`Backup was not found: ${id}`);
    this.name = 'BackupNotFoundError';
  }
}

export class BackupFileMissingError extends Error {
  constructor(filePath: string) {
    super(`Backup file was not found: ${filePath}`);
    this.name = 'BackupFileMissingError';
  }
}

export class BackupService {
  constructor(
    private readonly backupRepository: BackupRepository,
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
    private readonly storagePaths: StoragePaths,
  ) {}

  public create(input: CreateBackupInput = {}): BackupSnapshot {
    ensureStorageDirectories(this.storagePaths);

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const accounts = this.accountService.exportMetadata();
    const config = this.configService.list();
    const payload: BackupPayload = {
      version: BACKUP_PAYLOAD_VERSION,
      createdAt: now,
      accounts,
      config,
    };
    const label = normalizeLabel(input.label, now);
    const filePath = path.join(this.storagePaths.backupsDir, `${id}.json`);

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');

    return this.backupRepository.create({
      id,
      label,
      kind: input.kind ?? 'manual',
      payloadVersion: BACKUP_PAYLOAD_VERSION,
      filePath,
      createdAt: now,
      restoredAt: null,
      accountCount: accounts.length,
      configCount: config.length,
    });
  }

  public list(): BackupSnapshot[] {
    return this.backupRepository.list();
  }

  public restore(id: string): RestoreBackupResult {
    const snapshot = this.getRequiredSnapshot(id);

    if (!fs.existsSync(snapshot.filePath)) {
      throw new BackupFileMissingError(snapshot.filePath);
    }

    const payload = JSON.parse(
      fs.readFileSync(snapshot.filePath, 'utf8'),
    ) as BackupPayload;
    const accounts = this.accountService.importMetadata(payload.accounts);
    const restoredAt = new Date().toISOString();
    const restoredSnapshot = this.backupRepository.markRestored(id, restoredAt);

    return {
      snapshot: restoredSnapshot ?? {
        ...snapshot,
        restoredAt,
      },
      accounts,
    };
  }

  public delete(id: string): boolean {
    const snapshot = this.backupRepository.getById(id);

    if (!snapshot) {
      return false;
    }

    if (fs.existsSync(snapshot.filePath)) {
      fs.unlinkSync(snapshot.filePath);
    }

    return this.backupRepository.delete(id);
  }

  private getRequiredSnapshot(id: string): BackupSnapshot {
    const snapshot = this.backupRepository.getById(id);

    if (!snapshot) {
      throw new BackupNotFoundError(id);
    }

    return snapshot;
  }
}

function normalizeLabel(label: string | null | undefined, createdAt: string) {
  const normalized = label?.trim();

  return normalized || `Manual backup ${createdAt}`;
}
