import type { IpcMainInvokeEvent } from 'electron';

import type {
  AccountImportRecord,
  CreateAccountInput,
  UpdateAccountInput,
} from '../../shared/account/account';
import { getAccountService } from './service';

export function createAccount(
  _event: IpcMainInvokeEvent,
  input: CreateAccountInput,
) {
  return getAccountService().create(input);
}

export function listAccounts() {
  return getAccountService().list();
}

export function updateAccount(
  _event: IpcMainInvokeEvent,
  id: string,
  input: UpdateAccountInput,
) {
  return getAccountService().update(id, input);
}

export function deleteAccount(_event: IpcMainInvokeEvent, id: string) {
  return getAccountService().delete(id);
}

export function exportAccounts() {
  return getAccountService().exportMetadata();
}

export function importAccounts(
  _event: IpcMainInvokeEvent,
  records: AccountImportRecord[],
) {
  return getAccountService().importMetadata(records);
}
