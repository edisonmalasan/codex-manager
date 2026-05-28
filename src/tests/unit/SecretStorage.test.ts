import { describe, expect, it } from 'vitest';

import { InMemorySecretStorage } from '../../storage/secrets/InMemorySecretStorage';

describe('InMemorySecretStorage', () => {
  it('stores secrets behind a reference boundary', async () => {
    const storage = new InMemorySecretStorage();
    const reference = {
      service: 'codex-manager-test',
      account: 'local-api-key',
    };

    await storage.setSecret(reference, 'super-secret');

    expect(await storage.getSecret(reference)).toBe('super-secret');
    expect(
      await storage.getSecret({
        service: 'codex-manager-test',
        account: 'other',
      }),
    ).toBeNull();
  });

  it('deletes secrets by reference', async () => {
    const storage = new InMemorySecretStorage();
    const reference = {
      service: 'codex-manager-test',
      account: 'local-api-key',
    };

    await storage.setSecret(reference, 'super-secret');

    expect(await storage.deleteSecret(reference)).toBe(true);
    expect(await storage.getSecret(reference)).toBeNull();
    expect(await storage.deleteSecret(reference)).toBe(false);
  });
});
