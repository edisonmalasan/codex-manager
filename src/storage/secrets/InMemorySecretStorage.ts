import type { SecretReference, SecretStorage } from './SecretStorage';

export class InMemorySecretStorage implements SecretStorage {
  private readonly secrets = new Map<string, string>();

  public async getSecret(reference: SecretReference): Promise<string | null> {
    return this.secrets.get(this.createKey(reference)) ?? null;
  }

  public async setSecret(
    reference: SecretReference,
    value: string,
  ): Promise<void> {
    this.secrets.set(this.createKey(reference), value);
  }

  public async deleteSecret(reference: SecretReference): Promise<boolean> {
    return this.secrets.delete(this.createKey(reference));
  }

  private createKey(reference: SecretReference): string {
    return `${reference.service}:${reference.account}`;
  }
}
