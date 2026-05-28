import type { AppInfo, HealthStatus } from './ipc/contracts';

export interface CodexManagerBridge {
  app: {
    getInfo: () => Promise<AppInfo>;
  };
  health: {
    ping: () => Promise<HealthStatus>;
  };
}

declare global {
  interface Window {
    codexManager: CodexManagerBridge;
  }
}
