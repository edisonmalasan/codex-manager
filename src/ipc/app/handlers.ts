import { app } from 'electron';

import { AppInfoService } from '../../services/app/AppInfoService';

const appInfoService = new AppInfoService(app);

export function getAppInfo() {
  return appInfoService.getInfo();
}
