import type { AppInfo } from '../../shared/ipc/contracts';

interface ElectronAppInfoSource {
  getName: () => string;
  getVersion: () => string;
  isPackaged: boolean;
}

export class AppInfoService {
  constructor(private readonly app: ElectronAppInfoSource) {}

  public getInfo(): AppInfo {
    return {
      name: this.app.getName(),
      version: this.app.getVersion(),
      platform: process.platform,
      isPackaged: this.app.isPackaged,
    };
  }
}
