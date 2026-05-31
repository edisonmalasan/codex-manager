import type { Database } from 'better-sqlite3';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

interface ConfigRow {
  value_json: string;
}

interface ConfigListRow extends ConfigRow {
  namespace: string;
  key: string;
}

export class ConfigRepository {
  constructor(private readonly database: Database) {}

  public get<T extends JsonValue>(namespace: string, key: string): T | null {
    const row = this.database
      .prepare(
        'SELECT value_json FROM app_config WHERE namespace = ? AND key = ?',
      )
      .get(namespace, key) as ConfigRow | undefined;

    if (!row) {
      return null;
    }

    return JSON.parse(row.value_json) as T;
  }

  public set(namespace: string, key: string, value: JsonValue): void {
    this.database
      .prepare(
        `
        INSERT INTO app_config (namespace, key, value_json, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(namespace, key)
        DO UPDATE SET
          value_json = excluded.value_json,
          updated_at = CURRENT_TIMESTAMP
      `,
      )
      .run(namespace, key, JSON.stringify(value));
  }

  public delete(namespace: string, key: string): boolean {
    const result = this.database
      .prepare('DELETE FROM app_config WHERE namespace = ? AND key = ?')
      .run(namespace, key);

    return result.changes > 0;
  }

  public list(): Array<{ namespace: string; key: string; value: JsonValue }> {
    return (
      this.database
        .prepare(
          `
          SELECT namespace, key, value_json
          FROM app_config
          ORDER BY namespace ASC, key ASC
        `,
        )
        .all() as ConfigListRow[]
    ).map((row) => ({
      namespace: row.namespace,
      key: row.key,
      value: JSON.parse(row.value_json) as JsonValue,
    }));
  }
}
