export interface SecretReference {
  service: string;
  account: string;
}

export interface SecretStorage {
  getSecret(reference: SecretReference): Promise<string | null>;
  setSecret(reference: SecretReference, value: string): Promise<void>;
  deleteSecret(reference: SecretReference): Promise<boolean>;
}
