import type { JsonValue } from '../../storage/config/ConfigRepository';
import { ConfigRepository } from '../../storage/config/ConfigRepository';

export class ConfigService {
  constructor(private readonly configRepository: ConfigRepository) {}

  public get<T extends JsonValue>(namespace: string, key: string): T | null {
    return this.configRepository.get<T>(namespace, key);
  }

  public set(namespace: string, key: string, value: JsonValue): void {
    this.configRepository.set(namespace, key, value);
  }

  public delete(namespace: string, key: string): boolean {
    return this.configRepository.delete(namespace, key);
  }

  public list(): Array<{ namespace: string; key: string; value: JsonValue }> {
    return this.configRepository.list();
  }
}
