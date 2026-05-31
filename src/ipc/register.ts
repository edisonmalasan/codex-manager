import { ipcMain } from 'electron';

import { IPC_CHANNELS } from '../shared/ipc/channels';
import {
  createAccount,
  deleteAccount,
  exportAccounts,
  importAccounts,
  listAccounts,
  updateAccount,
} from './account/handlers';
import { getAppInfo } from './app/handlers';
import {
  createBackup,
  deleteBackup,
  listBackups,
  restoreBackup,
} from './backup/handlers';
import { pingHealth } from './health/handlers';

let registered = false;

export function registerIpcHandlers() {
  if (registered) {
    return;
  }

  ipcMain.handle(IPC_CHANNELS.appGetInfo, getAppInfo);
  ipcMain.handle(IPC_CHANNELS.healthPing, pingHealth);
  ipcMain.handle(IPC_CHANNELS.accountCreate, createAccount);
  ipcMain.handle(IPC_CHANNELS.accountList, listAccounts);
  ipcMain.handle(IPC_CHANNELS.accountUpdate, updateAccount);
  ipcMain.handle(IPC_CHANNELS.accountDelete, deleteAccount);
  ipcMain.handle(IPC_CHANNELS.accountExport, exportAccounts);
  ipcMain.handle(IPC_CHANNELS.accountImport, importAccounts);
  ipcMain.handle(IPC_CHANNELS.backupCreate, createBackup);
  ipcMain.handle(IPC_CHANNELS.backupList, listBackups);
  ipcMain.handle(IPC_CHANNELS.backupRestore, restoreBackup);
  ipcMain.handle(IPC_CHANNELS.backupDelete, deleteBackup);

  registered = true;
}
