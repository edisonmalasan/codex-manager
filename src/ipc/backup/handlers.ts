import type { IpcMainInvokeEvent } from 'electron';

import type { CreateBackupInput } from '../../shared/backup/backup';
import { getBackupService } from './service';

export function createBackup(
  _event: IpcMainInvokeEvent,
  input?: CreateBackupInput,
) {
  return getBackupService().create(input);
}

export function listBackups() {
  return getBackupService().list();
}

export function restoreBackup(_event: IpcMainInvokeEvent, id: string) {
  return getBackupService().restore(id);
}

export function deleteBackup(_event: IpcMainInvokeEvent, id: string) {
  return getBackupService().delete(id);
}
