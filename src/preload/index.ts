import { contextBridge, ipcRenderer } from 'electron';

import { IPC_CHANNELS } from '../shared/ipc/channels';
import type { CodexManagerBridge } from '../shared/preload-api';

const bridge: CodexManagerBridge = {
  app: {
    getInfo: () => ipcRenderer.invoke(IPC_CHANNELS.appGetInfo),
  },
  health: {
    ping: () => ipcRenderer.invoke(IPC_CHANNELS.healthPing),
  },
  accounts: {
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.accountCreate, input),
    list: () => ipcRenderer.invoke(IPC_CHANNELS.accountList),
    update: (id, input) =>
      ipcRenderer.invoke(IPC_CHANNELS.accountUpdate, id, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.accountDelete, id),
    exportMetadata: () => ipcRenderer.invoke(IPC_CHANNELS.accountExport),
    importMetadata: (records) =>
      ipcRenderer.invoke(IPC_CHANNELS.accountImport, records),
  },
  backups: {
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.backupCreate, input),
    list: () => ipcRenderer.invoke(IPC_CHANNELS.backupList),
    restore: (id) => ipcRenderer.invoke(IPC_CHANNELS.backupRestore, id),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.backupDelete, id),
  },
};

contextBridge.exposeInMainWorld('codexManager', bridge);
