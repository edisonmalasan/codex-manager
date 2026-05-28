export interface AppInfo {
  name: string;
  version: string;
  platform: NodeJS.Platform;
  isPackaged: boolean;
}

export interface HealthStatus {
  status: 'ok';
  checkedAt: string;
}
