import { ipcMain } from 'electron';

import { IPC_CHANNELS } from '../shared/ipc/channels';
import { getAppInfo } from './app/handlers';
import { pingHealth } from './health/handlers';

let registered = false;

export function registerIpcHandlers() {
  if (registered) {
    return;
  }

  ipcMain.handle(IPC_CHANNELS.appGetInfo, getAppInfo);
  ipcMain.handle(IPC_CHANNELS.healthPing, pingHealth);

  registered = true;
}
