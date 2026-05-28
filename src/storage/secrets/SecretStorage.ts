import type { SecretReference } from '../../shared/secrets/secret-reference';

export type { SecretReference };

export interface SecretStorage {
  getSecret(reference: SecretReference): Promise<string | null>;
  setSecret(reference: SecretReference, value: string): Promise<void>;
  deleteSecret(reference: SecretReference): Promise<boolean>;
}
