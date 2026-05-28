import type { Database } from 'better-sqlite3';

export interface Migration {
  id: string;
  description: string;
  up: (database: Database) => void;
}
