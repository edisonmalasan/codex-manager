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

  registered = true;
}
