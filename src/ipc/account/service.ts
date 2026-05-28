import { AccountService } from '../../services/account/AccountService';
import { AccountRepository } from '../../storage/account/AccountRepository';
import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';
import { getMainProcessDatabase } from '../../main/persistence';

let accountService: AccountService | null = null;

export function getAccountService(): AccountService {
  if (accountService) {
    return accountService;
  }

  accountService = new AccountService(
    new AccountRepository(getMainProcessDatabase()),
    new InMemorySecretStorage(),
  );

  return accountService;
}
