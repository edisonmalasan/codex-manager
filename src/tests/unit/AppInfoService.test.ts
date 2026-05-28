import { describe, expect, it } from 'vitest';

import { AppInfoService } from '../../services/app/AppInfoService';

describe('AppInfoService', () => {
  it('returns safe app metadata', () => {
    const service = new AppInfoService({
      getName: () => 'codex-manager',
      getVersion: () => '1.0.0',
      isPackaged: false,
    });

    expect(service.getInfo()).toMatchObject({
      name: 'codex-manager',
      version: '1.0.0',
      isPackaged: false,
    });
  });
});
