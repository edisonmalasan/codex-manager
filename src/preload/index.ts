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
};

contextBridge.exposeInMainWorld('codexManager', bridge);
