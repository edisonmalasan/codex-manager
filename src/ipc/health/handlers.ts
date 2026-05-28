import { HealthService } from '../../services/health/HealthService';

const healthService = new HealthService();

export function pingHealth() {
  return healthService.ping();
}
