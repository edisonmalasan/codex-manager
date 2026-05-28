import { describe, expect, it } from 'vitest';

import { HealthService } from '../../services/health/HealthService';

describe('HealthService', () => {
  it('returns an ok health status with a timestamp', () => {
    const status = new HealthService().ping();

    expect(status.status).toBe('ok');
    expect(Date.parse(status.checkedAt)).not.toBeNaN();
  });
});
