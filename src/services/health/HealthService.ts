import type { HealthStatus } from '../../shared/ipc/contracts';

export class HealthService {
  public ping(): HealthStatus {
    return {
      status: 'ok',
      checkedAt: new Date().toISOString(),
    };
  }
}
