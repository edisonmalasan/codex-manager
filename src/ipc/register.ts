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
import {
  batchRefreshQuota,
  getQuota,
  listQuotas,
  refreshQuota,
  setQuotaThreshold,
} from './quota/handlers';
import {
  getSwitchingState,
  listSwitchHistory,
  rollbackSwitch,
  switchAccount,
} from './switching/handlers';

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
  ipcMain.handle(IPC_CHANNELS.quotaRefresh, refreshQuota);
  ipcMain.handle(IPC_CHANNELS.quotaBatchRefresh, batchRefreshQuota);
  ipcMain.handle(IPC_CHANNELS.quotaList, listQuotas);
  ipcMain.handle(IPC_CHANNELS.quotaGet, getQuota);
  ipcMain.handle(IPC_CHANNELS.quotaSetThreshold, setQuotaThreshold);
  ipcMain.handle(IPC_CHANNELS.switchingGetState, getSwitchingState);
  ipcMain.handle(IPC_CHANNELS.switchingHistory, listSwitchHistory);
  ipcMain.handle(IPC_CHANNELS.switchingSwitch, switchAccount);
  ipcMain.handle(IPC_CHANNELS.switchingRollback, rollbackSwitch);

  registered = true;
}
