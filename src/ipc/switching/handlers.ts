import type { IpcMainInvokeEvent } from 'electron';

import type {
  ManualSwitchInput,
  RollbackSwitchInput,
} from '../../shared/switching/switching';
import { getSwitchingService } from './service';

export function getSwitchingState() {
  return getSwitchingService().getState();
}

export function listSwitchHistory() {
  return getSwitchingService().listHistory();
}

export function switchAccount(
  _event: IpcMainInvokeEvent,
  input: ManualSwitchInput,
) {
  return getSwitchingService().switchAccount(input);
}

export function rollbackSwitch(
  _event: IpcMainInvokeEvent,
  input: RollbackSwitchInput = {},
) {
  return getSwitchingService().rollback(input);
}
