import { getAccountService } from '../account/service';
import { getBackupService } from '../backup/service';
import { getMainProcessDatabase } from '../../main/persistence';
import { SwitchingService } from '../../services/switching/SwitchingService';
import { SwitchingRepository } from '../../storage/switching/SwitchingRepository';

let switchingService: SwitchingService | null = null;

export function getSwitchingService(): SwitchingService {
  if (switchingService) {
    return switchingService;
  }

  switchingService = new SwitchingService(
    new SwitchingRepository(getMainProcessDatabase()),
    getAccountService(),
    getBackupService(),
  );

  return switchingService;
}
