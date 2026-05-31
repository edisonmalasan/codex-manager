import { getAccountService } from '../account/service';
import { getMainProcessDatabase } from '../../main/persistence';
import { QuotaService } from '../../services/quota/QuotaService';
import { QuotaRepository } from '../../storage/quota/QuotaRepository';

let quotaService: QuotaService | null = null;

export function getQuotaService(): QuotaService {
  if (quotaService) {
    return quotaService;
  }

  quotaService = new QuotaService(
    new QuotaRepository(getMainProcessDatabase()),
    getAccountService(),
  );

  return quotaService;
}
