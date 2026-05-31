import type { IpcMainInvokeEvent } from 'electron';

import type {
  BatchRefreshQuotaInput,
  RefreshQuotaInput,
  SetQuotaThresholdInput,
} from '../../shared/quota/quota';
import { getQuotaService } from './service';

export function refreshQuota(
  _event: IpcMainInvokeEvent,
  input: RefreshQuotaInput,
) {
  return getQuotaService().refresh(input);
}

export function batchRefreshQuota(
  _event: IpcMainInvokeEvent,
  input: BatchRefreshQuotaInput,
) {
  return getQuotaService().batchRefresh(input);
}

export function listQuotas() {
  return getQuotaService().list();
}

export function getQuota(_event: IpcMainInvokeEvent, accountId: string) {
  return getQuotaService().get(accountId);
}

export function setQuotaThreshold(
  _event: IpcMainInvokeEvent,
  input: SetQuotaThresholdInput,
) {
  return getQuotaService().setThreshold(input);
}
